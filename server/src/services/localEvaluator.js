// Local Code Evaluator - Runs JavaScript code against hardcoded test cases
// No external API required — uses Node.js vm module for sandboxed execution
import vm from 'node:vm';
import logger from '../utils/logger.js';

/**
 * Safely execute JavaScript code in a sandboxed VM context
 * @param {string} code - User's code
 * @param {string} expression - Expression to evaluate after running code (e.g. "twoSum([2,7,11,15], 9)")
 * @param {number} timeoutMs - Max execution time in ms
 * @returns {{ output: any, error: string|null }}
 */
const runInSandbox = (code, expression, timeoutMs = 3000) => {
  try {
    const sandbox = {
      console: { log: () => {}, error: () => {}, warn: () => {} },
      result: undefined,
    };

    vm.createContext(sandbox);

    // Run user's code to define functions
    vm.runInContext(code, sandbox, { timeout: timeoutMs });

    // Evaluate the test expression to get the result
    const result = vm.runInContext(expression, sandbox, { timeout: timeoutMs });

    return { output: result, error: null };
  } catch (err) {
    return { output: null, error: err.message };
  }
};

/**
 * Normalize a value for comparison — handles arrays, objects, primitives
 */
const normalize = (val) => {
  if (val === undefined || val === null) return String(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).trim();
};

/**
 * Compare actual output with expected output
 * Handles: primitives, arrays, objects, stringified values
 */
const compareOutputs = (actual, expected) => {
  const normActual = normalize(actual);

  // Expected could be a string like "[0,1]" or "true" or "15"
  let normExpected;
  if (typeof expected === 'string') {
    normExpected = expected.trim();
  } else {
    normExpected = normalize(expected);
  }

  // Direct comparison
  if (normActual === normExpected) return true;

  // Try comparing as parsed values (handles "[0,1]" vs [0,1])
  try {
    const parsedExpected = JSON.parse(normExpected);
    const parsedActual = typeof actual === 'string' ? JSON.parse(actual) : actual;

    // For arrays — sort if order doesn't matter (but default to order-sensitive)
    if (JSON.stringify(parsedActual) === JSON.stringify(parsedExpected)) return true;
  } catch {
    // Not JSON, that's fine
  }

  // Numeric comparison
  if (!isNaN(normActual) && !isNaN(normExpected)) {
    return Number(normActual) === Number(normExpected);
  }

  // Boolean comparison
  if ((normActual === 'true' || normActual === 'false') && (normExpected === 'true' || normExpected === 'false')) {
    return normActual === normExpected;
  }

  return false;
};

/**
 * Execute code against hardcoded test cases
 * @param {string} code - User's JavaScript code
 * @param {Array} testCases - Array of { input, expected_output, fn_name?, description? }
 *   input: string expression to call, e.g. "twoSum([2,7,11,15], 9)"
 *   expected_output: expected return value as string, e.g. "[0,1]"
 * @returns {{ passed, results, totalTests, passedTests, score, feedback }}
 */
export const evaluateLocally = (code, testCases) => {
  if (!testCases || testCases.length === 0) {
    throw new Error('No test cases provided for local evaluation');
  }

  const results = [];
  let passedTests = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const expression = tc.input; // e.g. "twoSum([2,7,11,15], 9)"

    const { output, error } = runInSandbox(code, expression);

    const actualStr = normalize(output);
    const passed = !error && compareOutputs(output, tc.expected_output);

    if (passed) passedTests++;

    results.push({
      testCase: tc.description || `Test ${i + 1}`,
      input: expression,
      expectedOutput: tc.expected_output,
      actualOutput: error ? `Error: ${error}` : actualStr,
      passed,
      error: error || null,
      status: error
        ? (error.includes('timed out') ? 'Timeout' : 'Runtime Error')
        : (passed ? 'Accepted' : 'Wrong Answer'),
    });
  }

  const allPassed = passedTests === testCases.length;
  const score = Math.round((passedTests / testCases.length) * 100);

  const feedback = allPassed
    ? 'All test cases passed! Great work, Hunter!'
    : `${passedTests}/${testCases.length} test cases passed. Keep trying!`;

  logger.info(`Local evaluation: ${passedTests}/${testCases.length} passed (score: ${score})`);

  return {
    passed: allPassed,
    results,
    totalTests: testCases.length,
    passedTests,
    score,
    feedback,
  };
};

/**
 * Run code in sandbox and return stdout (for "Run" button)
 * @param {string} code - User's JavaScript code
 * @returns {{ stdout, stderr, status }}
 */
export const runLocally = (code) => {
  try {
    const logs = [];
    const sandbox = {
      console: {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args) => logs.push('[ERROR] ' + args.map(a => String(a)).join(' ')),
        warn: (...args) => logs.push('[WARN] ' + args.map(a => String(a)).join(' ')),
      },
    };

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { timeout: 5000 });

    return {
      stdout: logs.join('\n'),
      stderr: '',
      status: 'Success',
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: err.message,
      status: err.message.includes('timed out') ? 'Timeout' : 'Runtime Error',
    };
  }
};
