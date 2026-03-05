// Gemini AI Service - AI-powered quest generation
import { model, GEMINI_ENABLED } from '../config/gemini.js';
import logger from '../utils/logger.js';

/**
 * Generate a coding quest using Gemini AI
 * Falls back to templates if Gemini is not configured
 */
export const generateQuest = async (niche, difficulty, userLevel) => {
  if (!GEMINI_ENABLED) {
    logger.info('Gemini not configured - using template quest');
    return getTemplateQuest(niche, difficulty);
  }

  try {
    const prompt = `Generate a coding quest for a ${difficulty} difficulty ${niche} challenge suitable for a level ${userLevel} developer.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "title": "short quest title",
  "description": "detailed problem description",
  "test_cases": [
    { "input": "input value", "expected_output": "expected output" }
  ],
  "starter_code": "function template with comments",
  "difficulty": "${difficulty}",
  "xp_reward": number,
  "quest_type": "main"
}

Include 3-5 test cases. The xp_reward should be ${difficulty === 'hard' ? '120-200' : difficulty === 'medium' ? '60-100' : '30-60'}.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Strip markdown fences if present
    let cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const quest = JSON.parse(cleaned);

    logger.info(`Gemini generated quest: ${quest.title}`);
    return quest;
  } catch (err) {
    logger.error('Gemini quest generation failed, using template:', err.message);
    return getTemplateQuest(niche, difficulty);
  }
};

/**
 * Template quests for when AI is not available
 */
function getTemplateQuest(niche, difficulty) {
  const templates = {
    DSA: {
      easy: {
        title: 'Array Sum Challenge',
        description: 'Write a function that returns the sum of all elements in an array.',
        test_cases: [
          { input: '[1,2,3,4,5]', expected_output: '15' },
          { input: '[10,20,30]', expected_output: '60' },
          { input: '[]', expected_output: '0' },
        ],
        starter_code: 'function arraySum(arr) {\n  // Your code here\n}',
      },
      medium: {
        title: 'Find Duplicates',
        description: 'Given an array of integers, find all elements that appear more than once.',
        test_cases: [
          { input: '[1,2,3,2,1,4]', expected_output: '[1,2]' },
          { input: '[1,1,1]', expected_output: '[1]' },
        ],
        starter_code: 'function findDuplicates(arr) {\n  // Your code here\n}',
      },
      hard: {
        title: 'Longest Increasing Subsequence',
        description: 'Find the length of the longest strictly increasing subsequence.',
        test_cases: [
          { input: '[10,9,2,5,3,7,101,18]', expected_output: '4' },
          { input: '[0,1,0,3,2,3]', expected_output: '4' },
        ],
        starter_code: 'function lengthOfLIS(nums) {\n  // Your code here\n}',
      },
    },
    Frontend: {
      easy: {
        title: 'CSS Color Converter',
        description: 'Write a function that converts hex color codes to RGB format.',
        test_cases: [
          { input: '"#FF0000"', expected_output: '"rgb(255, 0, 0)"' },
          { input: '"#00FF00"', expected_output: '"rgb(0, 255, 0)"' },
        ],
        starter_code: 'function hexToRgb(hex) {\n  // Your code here\n}',
      },
    },
    Backend: {
      easy: {
        title: 'URL Parser',
        description: 'Write a function that parses a URL and returns its components.',
        test_cases: [
          { input: '"https://example.com/path?key=value"', expected_output: '{"protocol":"https","host":"example.com","path":"/path","query":"key=value"}' },
        ],
        starter_code: 'function parseUrl(url) {\n  // Your code here\n}',
      },
    },
  };

  const nicheTemplates = templates[niche] || templates.DSA;
  const diffTemplates = nicheTemplates[difficulty] || nicheTemplates.easy;

  return {
    ...diffTemplates,
    difficulty,
    xp_reward: difficulty === 'hard' ? 150 : difficulty === 'medium' ? 80 : 50,
    quest_type: 'main',
  };
}

export default { generateQuest };
