import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let geminiClient = null;
let openaiClient = null;

const initAIClients = () => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      geminiClient = new GoogleGenerativeAI(geminiKey);
      console.log('✨ Google Gemini AI Client initialized');
    } catch (err) {
      console.error('❌ Failed to initialize Gemini client:', err.message);
    }
  }

  if (openaiKey) {
    try {
      openaiClient = new OpenAI({ apiKey: openaiKey });
      console.log('✨ OpenAI Client initialized');
    } catch (err) {
      console.error('❌ Failed to initialize OpenAI client:', err.message);
    }
  }

  if (!geminiKey && !openaiKey) {
    console.log('ℹ️ No Gemini or OpenAI API keys found in env. Running in offline rule-based NLP mode.');
  }
};

initAIClients();

export const getAIClient = () => {
  return {
    gemini: geminiClient,
    openai: openaiClient,
    isConfigured: !!(geminiClient || openaiClient)
  };
};

/**
 * Runs a structured prompt on the available AI model.
 * Automatically tries Gemini first, then OpenAI, and returns JSON or raw text.
 */
export const runAIPrompt = async (prompt, systemInstruction = '') => {
  const { gemini, openai } = getAIClient();

  if (gemini) {
    try {
      // Use gemini-1.5-flash which is extremely fast and efficient
      const model = gemini.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      
      const fullPrompt = systemInstruction 
        ? `${systemInstruction}\n\nUser request:\n${prompt}`
        : prompt;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.error('⚠️ Gemini API execution failed, trying OpenAI or local fallback:', err.message);
    }
  }

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction || 'You are an advanced AI Resume Analyzer.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (err) {
      console.error('⚠️ OpenAI API execution failed:', err.message);
    }
  }

  throw new Error('No functional AI API clients available or APIs returned errors.');
};
