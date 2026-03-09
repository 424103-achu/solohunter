import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
export const GROQ_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_ENABLED = !!GROQ_API_KEY;

export const groqChat = async (messages, temperature = 0.7, maxTokens = 3000) => {
  if (!GROQ_ENABLED) throw new Error('GROQ_API_KEY not configured in .env');

  const response = await axios.post(
    GROQ_API_URL,
    { model: GROQ_MODEL, messages, temperature, max_tokens: maxTokens },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data.choices[0].message.content;
};
