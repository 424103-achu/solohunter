// Multi-language local code runner using child_process
// Supports: python, java, cpp, javascript
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

const isWindows = process.platform === 'win32';
const TIMEOUT_MS = 10000;

// Run a subprocess, pipe stdin, collect stdout/stderr
const runProcess = (command, args, input, cwd) => {
  return new Promise((resolve, reject) => {
    let proc;
    try {
      proc = spawn(command, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (err) {
      return reject(err);
    }

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try { proc.kill('SIGKILL'); } catch {}
    }, TIMEOUT_MS);

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    // Always write stdin so Scanner / input() don't get immediate EOF.
    // Ensure it ends with a newline so line-based readers (Scanner.nextLine,
    // Python input()) can consume the last token cleanly.
    try {
      const toWrite = (input == null ? '' : String(input));
      proc.stdin.write(toWrite.endsWith('\n') ? toWrite : toWrite + '\n');
    } catch {}
    try { proc.stdin.end(); } catch {}

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim(), exitCode: code, timedOut });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

// Try multiple commands in order, use first that is available.
// Returns { notFound: true } if no candidate is in PATH instead of throwing.
const runFirstAvailable = async (candidates, args, input, cwd) => {
  for (const cmd of candidates) {
    try {
      const result = await runProcess(cmd, args, input, cwd);
      return result;
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      // command not found — try next candidate
    }
  }
  return { notFound: true, command: candidates[0], stdout: '', stderr: '', timedOut: false, exitCode: 127 };
};

// Execute code in a temp dir and return { stdout, stderr, status }
export const runSandbox = async (code, language, stdin = '') => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `run-${uuidv4().slice(0, 8)}-`));

  try {
    if (language === 'python') {
      const file = path.join(tmpDir, 'solution.py');
      await fs.writeFile(file, code, 'utf8');
      const res = await runFirstAvailable(
        isWindows ? ['python', 'python3'] : ['python3', 'python'],
        ['-u', file], stdin, tmpDir
      );
      if (res.notFound) return { stdout: '', stderr: 'Python is not installed or not in PATH.', status: 'Error' };
      const { stdout, stderr, timedOut } = res;
      return { stdout, stderr, status: timedOut ? 'Timeout' : (stderr ? 'Runtime Error' : 'Success') };
    }

    if (language === 'javascript') {
      const file = path.join(tmpDir, 'solution.js');
      await fs.writeFile(file, code, 'utf8');
      const { stdout, stderr, timedOut } = await runProcess('node', [file], stdin, tmpDir);
      return { stdout, stderr, status: timedOut ? 'Timeout' : (stderr ? 'Runtime Error' : 'Success') };
    }

    if (language === 'java') {
      const file = path.join(tmpDir, 'Main.java');
      await fs.writeFile(file, code, 'utf8');
      const compile = await runFirstAvailable(['javac'], [file], '', tmpDir);
      if (compile.notFound) return { stdout: '', stderr: 'Java (javac) is not installed or not in PATH.', status: 'Error' };
      if (compile.exitCode !== 0 || compile.stderr) {
        return { stdout: '', stderr: compile.stderr, status: 'Compilation Error' };
      }
      const run = await runFirstAvailable(['java'], ['-cp', tmpDir, 'Main'], stdin, tmpDir);
      if (run.notFound) return { stdout: '', stderr: 'Java runtime not found in PATH.', status: 'Error' };
      const { stdout, stderr, timedOut } = run;
      return { stdout, stderr, status: timedOut ? 'Timeout' : (stderr ? 'Runtime Error' : 'Success') };
    }

    if (language === 'cpp' || language === 'c') {
      const ext = language === 'cpp' ? '.cpp' : '.c';
      // Try g++ first, then gcc as fallback for C++
      const compilerCandidates = language === 'cpp' ? ['g++', 'gcc'] : ['gcc'];
      const source = path.join(tmpDir, `solution${ext}`);
      const binary = path.join(tmpDir, isWindows ? 'output.exe' : 'output');
      await fs.writeFile(source, code, 'utf8');
      const compileArgs = language === 'cpp'
        ? [source, '-o', binary, '-lm', '-lstdc++']
        : [source, '-o', binary, '-lm'];
      const compile = await runFirstAvailable(compilerCandidates, compileArgs, '', tmpDir);
      if (compile.notFound) return { stdout: '', stderr: `C++ compiler (g++/gcc) is not installed or not in PATH.`, status: 'Error' };
      if (compile.exitCode !== 0 || (compile.stderr && compile.stderr.includes('error:'))) {
        return { stdout: '', stderr: compile.stderr, status: 'Compilation Error' };
      }
      const run = await runFirstAvailable([binary], [], stdin, tmpDir);
      if (run.notFound) return { stdout: '', stderr: 'Compiled binary could not be executed.', status: 'Error' };
      const { stdout, stderr, timedOut } = run;
      return { stdout, stderr, status: timedOut ? 'Timeout' : (stderr ? 'Runtime Error' : 'Success') };
    }

    return { stdout: '', stderr: `Language "${language}" not supported`, status: 'Error' };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
};

// Run code against all test cases and return full results
export const evaluateWithTestCases = async (code, language, testCases) => {
  if (!testCases || testCases.length === 0) {
    throw new Error('No test cases provided');
  }

  const results = [];
  let passedTests = 0;

  // Check compilation once before running all tests (for compiled languages)
  if (language === 'java' || language === 'cpp' || language === 'c') {
    const probe = await runSandbox(code, language, testCases[0].input || '');
    if (probe.status === 'Compilation Error') {
      for (let i = 0; i < testCases.length; i++) {
        results.push({
          testCase: testCases[i].description || `Test ${i + 1}`,
          input: testCases[i].input,
          expectedOutput: (testCases[i].expected_output || '').trim(),
          actualOutput: '',
          passed: false,
          error: probe.stderr,
          status: 'Compilation Error',
        });
      }
      return { passed: false, results, totalTests: testCases.length, passedTests: 0, score: 0 };
    }
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let runResult;

    try {
      runResult = await runSandbox(code, language, tc.input || '');
    } catch (err) {
      runResult = { stdout: '', stderr: err.message, status: 'Error' };
    }

    const actualOutput = ((runResult.stdout || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')).trim();
    const expectedOutput = ((tc.expected_output || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')).trim();
    const passed =
      actualOutput === expectedOutput &&
      runResult.status !== 'Timeout' &&
      runResult.status !== 'Compilation Error';

    if (passed) passedTests++;

    results.push({
      testCase: tc.description || `Test ${i + 1}`,
      input: tc.input,
      expectedOutput,
      actualOutput,
      passed,
      error: runResult.stderr || null,
      status: runResult.timedOut
        ? 'Timeout'
        : (runResult.status === 'Compilation Error'
          ? 'Compilation Error'
          : (passed ? 'Accepted' : 'Wrong Answer')),
    });

    logger.debug(`Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'} | expected="${expectedOutput}" actual="${actualOutput}"`);
  }

  return {
    passed: passedTests === testCases.length,
    results,
    totalTests: testCases.length,
    passedTests,
    score: Math.round((passedTests / testCases.length) * 100),
  };
};
