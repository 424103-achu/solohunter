// Judge0 API Configuration
import dotenv from 'dotenv';
dotenv.config();

export const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
export const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';
export const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

// Language ID mapping for Judge0
export const LANGUAGE_IDS = {
  javascript: 63,   // Node.js
  python: 71,       // Python 3
  python3: 71,
  cpp: 54,          // C++ (GCC 9.2.0)
  'c++': 54,
  java: 62,         // Java (OpenJDK 13.0.1)
  c: 50,            // C (GCC 9.2.0)
  typescript: 74,   // TypeScript
  ruby: 72,         // Ruby
  go: 60,           // Go
  rust: 73,         // Rust
};

export const getLanguageId = (language) => {
  const lang = language.toLowerCase().trim();
  return LANGUAGE_IDS[lang] || LANGUAGE_IDS.javascript;
};
