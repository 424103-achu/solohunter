// Gemini AI Configuration - Core code evaluation engine
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
export const GEMINI_ENABLED = !!process.env.GEMINI_API_KEY;

let genAI = null;
let model = null;

if (GEMINI_ENABLED) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

export { genAI, model };
