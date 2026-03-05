// Code Evaluation Service - Powered by Gemini AI
import { model, GEMINI_ENABLED } from '../config/gemini.js';
import logger from '../utils/logger.js';

/**
 * Build the evaluation prompt for Gemini
 */
const buildEvalPrompt = (code, language, testCases) => {
  const testCaseStr = testCases.map((tc, i) =>
    `Test ${i + 1}:\n  Input: ${tc.input}\n  Expected Output: ${tc.expected_output}`
  ).join('\n');

  return `You are a strict code evaluator. Evaluate the following ${language} code against the test cases below.

IMPORTANT RULES:
1. Mentally execute the code for EACH test case. Do NOT be lenient.
2. Compare actual output with expected output EXACTLY (whitespace-trimmed).
3. If the code has syntax errors, runtime errors, or infinite loops, mark those tests as failed.
4. Respond ONLY with valid JSON — no markdown, no code fences, no explanation.

Code:
\`\`\`${language}
${code}
\`\`\`

Test Cases:
${testCaseStr}

Respond with EXACTLY this JSON structure (no other text):
{
  "results": [
    {
      "testIndex": 0,
      "passed": true/false,
      "actualOutput": "the output the code would produce",
      "error": null or "error description if any"
    }
  ]
}`;
};

/**
 * Build a sandbox evaluation prompt for running code without test cases
 */
const buildRunPrompt = (code, language, stdin) => {
  return `You are a code execution simulator. Mentally execute the following ${language} code and return what it would output to stdout.

${stdin ? `Stdin input: ${stdin}` : 'No stdin input.'}

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with EXACTLY this JSON structure (no other text, no markdown fences):
{
  "stdout": "the output the code prints",
  "stderr": "any error messages or empty string",
  "status": "Success" or "Runtime Error" or "Compilation Error" or "Timeout"
}`;
};

/**
 * Parse Gemini response - handles markdown fences and raw JSON
 */
const parseGeminiJSON = (text) => {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
};

/**
 * Evaluate code against a quest description using Gemini AI
 * Used when quests don't have explicit test cases stored in DB
 * Returns { passed, score, feedback, results, totalTests, passedTests }
 */
export const evaluateAgainstDescription = async (code, language, questDescription) => {
  if (!GEMINI_ENABLED) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
  }

  const prompt = `You are a strict code evaluator. Evaluate the following ${language} code against this quest description.

Quest Description:
${questDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Instructions:
1. Generate 3-5 test cases based on the quest description
2. Mentally execute the code for EACH test case
3. Determine if the code correctly solves the quest
4. Give a score from 0-100

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "passed": true/false,
  "score": 0-100,
  "feedback": "brief feedback on the solution",
  "results": [
    {
      "testCase": "description of test",
      "passed": true/false,
      "actualOutput": "what code produces",
      "expectedOutput": "what was expected",
      "error": null
    }
  ]
}`;

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = parseGeminiJSON(text);

    const results = parsed.results || [];
    const passedTests = results.filter(r => r.passed).length;

    logger.info(`Gemini description evaluation: ${passedTests}/${results.length} passed, score: ${parsed.score}`);

    return {
      passed: parsed.passed === true,
      score: parsed.score || 0,
      feedback: parsed.feedback || '',
      results,
      totalTests: results.length,
      passedTests,
    };
  } catch (err) {
    logger.error('Gemini description evaluation error:', err.message);
    throw new Error(`Code evaluation failed: ${err.message}`);
  }
};

/**
 * Execute code against test cases using Gemini AI evaluation
 * Returns { passed, results, totalTests, passedTests }
 */
export const executeCode = async (code, language, testCases) => {
  if (!GEMINI_ENABLED) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
  }

  const prompt = buildEvalPrompt(code, language, testCases);

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = parseGeminiJSON(text);

    const results = [];
    let passedTests = 0;

    for (let i = 0; i < testCases.length; i++) {
      const geminiResult = parsed.results?.[i];
      const tc = testCases[i];

      if (geminiResult) {
        const passed = geminiResult.passed === true;
        if (passed) passedTests++;

        results.push({
          input: tc.input,
          expectedOutput: (tc.expected_output || '').trim(),
          actualOutput: (geminiResult.actualOutput || '').trim(),
          passed,
          stderr: geminiResult.error || null,
          status: passed ? 'Accepted' : (geminiResult.error ? 'Runtime Error' : 'Wrong Answer'),
          executionTime: null,
          memoryUsed: null,
        });
      } else {
        // Gemini didn't return a result for this test case
        results.push({
          input: tc.input,
          expectedOutput: (tc.expected_output || '').trim(),
          actualOutput: null,
          passed: false,
          stderr: 'Evaluation incomplete for this test case',
          status: 'Error',
          executionTime: null,
          memoryUsed: null,
        });
      }
    }

    logger.info(`Gemini evaluation: ${passedTests}/${testCases.length} passed`);

    return {
      passed: passedTests === testCases.length,
      results,
      totalTests: testCases.length,
      passedTests,
    };
  } catch (err) {
    logger.error('Gemini evaluation error:', err.message);
    throw new Error(`Code evaluation failed: ${err.message}`);
  }
};

/**
 * Quick code execution simulation via Gemini (sandbox mode)
 */
export const runCode = async (code, language, stdin = '') => {
  if (!GEMINI_ENABLED) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
  }

  const prompt = buildRunPrompt(code, language, stdin);

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = parseGeminiJSON(text);

    return {
      stdout: (parsed.stdout || '').trim(),
      stderr: parsed.stderr || '',
      status: parsed.status || 'Unknown',
      executionTime: null,
      memoryUsed: null,
    };
  } catch (err) {
    logger.error('Gemini run error:', err.message);
    return {
      stdout: '',
      stderr: `Evaluation error: ${err.message}`,
      status: 'Error',
      executionTime: null,
      memoryUsed: null,
    };
  }
};
