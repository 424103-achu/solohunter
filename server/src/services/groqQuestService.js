// Groq AI Quest Generator — generates daily coding quests per user
import { groqChat, GROQ_ENABLED } from '../config/groq.js';
import pool from '../config/db.js';
import logger from '../utils/logger.js';

const getDifficulty = (level) => {
  if (level <= 5) return 'easy';
  if (level <= 15) return 'medium';
  return 'hard';
};

const getXpReward = (difficulty) => {
  const map = { easy: 45, medium: 90, hard: 150 };
  return map[difficulty] || 45;
};


const BLANK_STARTERS = {
  python: `import sys\ninput = sys.stdin.readline\n\ndef solve():\n    # write your solution here\n    pass\n\nsolve()\n`,
  java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // write your solution here\n    }\n}\n`,
};

// Solution-code patterns — if any appear in a starter, it gets replaced with blank template
const SOLUTION_PATTERNS = [
  /for\s+\w+\s+in\s+range\s*\(/,   // python for loop
  /while\s*\(/,                      // while loop
  /if\s+\w+.*:/,                     // python if
  /if\s*\(.*\)\s*\{/,               // java if
  /System\.out\.print/,             // java output
  /print\s*\(/,                     // python print (solution output)
  /return\s+\w+/,                   // return value
  /\+\+|--|\+=|-=|\*=|\/=/,        // mutation operators (calculations)
  /parseInt|parseFloat|atoi/,       // parsing (means solving)
  /\.split\s*\(|\.join\s*\(/,       // string ops that indicate solving
];

/**
 * Strips ANY solution logic from a starter string.
 * If the starter contains anything beyond imports + boilerplate + a comment,
 * it is replaced entirely with the safe blank template.
 */
const sanitizeStarter = (code, lang) => {
  if (!code || typeof code !== 'string') return BLANK_STARTERS[lang];
  const hasSolution = SOLUTION_PATTERNS.some(p => p.test(code));
  if (hasSolution) {
    logger.warn(`Groq leaked solution in ${lang} starter — replaced with blank template`);
    return BLANK_STARTERS[lang];
  }
  return code;
};

const parseGroqJSON = (text) => {
  let cleaned = text.trim();
  // Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // Find the JSON array start
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
};

const buildPrompt = (level, rank, difficulty) => `You are a competitive programming problem generator.
Generate exactly 2 distinct coding problems for a developer at level ${level}, rank ${rank}.
Difficulty: ${difficulty}

STRICT REQUIREMENTS:
- Standard input/output format ONLY (stdin → stdout). No function signatures.
- For Java: class MUST be named "Main" (public class Main)
- Include exactly 4 test cases per problem
- Each test_case input must be the exact bytes written to stdin
- Each expected_output must be the exact bytes printed to stdout (no trailing spaces)
- You MUST include a "starter_codes" object with BOTH "python" and "java" keys — do NOT use "starter_code" (singular)
- Use \\n inside JSON strings for newlines so the code is multi-line and readable
- Do NOT minify or compress the starter code onto one line

CRITICAL — STARTER CODE RULES (strictly enforced):
- The starter code is a BLANK TEMPLATE only — it must NOT contain any solution logic whatsoever
- It must ONLY contain: necessary import statements, the class/main boilerplate, and a single comment "// write your solution here" or "# write your solution here"
- Do NOT pre-fill any loops, conditionals, calculations, or output statements
- A user must write every single line of the solution themselves
- Wrong example (FORBIDDEN): "n = int(input())\\nfor _ in range(n):\\n    print('Hello World')"
- Correct example: "import sys\\ninput = sys.stdin.readline\\n\\ndef solve():\\n    # write your solution here\\n    pass\\n\\nsolve()\\n"

Respond with ONLY a raw JSON array — no markdown, no explanation, no extra text:
[
  {
    "title": "Short Quest Title",
    "description": "Full problem statement with Input/Output format section and 1 example",
    "difficulty": "${difficulty}",
    "xp_reward": ${getXpReward(difficulty)},
    "test_cases": [
      { "input": "exact stdin string", "expected_output": "exact stdout string", "description": "what this tests" }
    ],
    "starter_codes": {
      "python": "import sys\\ninput = sys.stdin.readline\\n\\ndef solve():\\n    # write your solution here\\n    pass\\n\\nsolve()\\n",
      "java": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // write your solution here\\n    }\\n}\\n"
    }
  }
]`;

export const generateDailyQuestsForUser = async (userId, level, rank) => {
  if (!GROQ_ENABLED) throw new Error('GROQ_API_KEY not configured');

  const difficulty = getDifficulty(level);
  const prompt = buildPrompt(level, rank, difficulty);

  logger.info(`Generating Groq quests for user ${userId} (level ${level}, rank ${rank}, difficulty ${difficulty})`);

  const raw = await groqChat([{ role: 'user', content: prompt }], 0.8, 3500);

  let quests;
  try {
    quests = parseGroqJSON(raw);
  } catch (err) {
    logger.error('Groq JSON parse failed. Raw response:', raw.slice(0, 500));
    throw new Error('Groq returned invalid JSON — quest generation failed');
  }

  if (!Array.isArray(quests) || quests.length === 0) {
    throw new Error('Groq returned empty quest list');
  }

  const stored = [];
  for (const q of quests.slice(0, 2)) {
    const xp = q.xp_reward || getXpReward(q.difficulty || difficulty);
    const spMap = { easy: 1, medium: 3, hard: 5 };
    const skillReward = spMap[q.difficulty || difficulty] ?? 1;

    const { rows } = await pool.query(
      `INSERT INTO quests
        (title, description, difficulty, xp_reward, skill_reward, quest_type,
         is_ai_generated, is_active, test_cases, starter_code, language, generated_for_user_id)
       VALUES ($1, $2, $3, $4, $5, 'daily', TRUE, TRUE, $6, $7, $8, $9)
       RETURNING *`,
      [
        q.title,
        q.description,
        q.difficulty || difficulty,
        xp,
        skillReward,
        JSON.stringify(q.test_cases || []),
        // Normalize to { python, java } map and sanitize each language starter
        JSON.stringify((() => {
          const raw = q.starter_codes && typeof q.starter_codes === 'object'
            ? q.starter_codes
            : (() => {
                const plain = q.starter_code || '';
                const isJava = /public\s+class\s+Main/.test(plain);
                return isJava ? { java: plain, python: '' } : { python: plain, java: '' };
              })();
          return {
            python: sanitizeStarter(raw.python, 'python'),
            java:   sanitizeStarter(raw.java,   'java'),
          };
        })()),
        'python', // default language (user can switch to java in UI)
        userId,
      ]
    );

    stored.push(rows[0]);
    logger.info(`Groq quest stored: "${q.title}" (${q.language}) for user ${userId}`);
  }

  return stored;
};
