import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { topic, botName, botStyle, context = [], difficulty, language = 'en' } = req.body;

    if (!topic || !botName || !botStyle || !difficulty) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const isArabic = language === 'ar';
    
    // EXACT SYSTEM INSTRUCTION FROM YOUR WORKING CODE
    const systemInstruction = `You are ${botName} in a cozy isometric room.
    Target Topic: "${topic}" (provided in ${isArabic ? 'Arabic' : 'English'})
    Your Personality: ${botStyle}
    Game Difficulty: ${difficulty}
    Language: ${isArabic ? 'Arabic' : 'English'}

    OBJECTIVE: Give a hint about the topic without saying it. Respond ONLY in ${isArabic ? 'Arabic' : 'English'}.

    STRICT CONSTRAINTS:
    1. MAX 2 WORDS per message (or equivalent in Arabic). Keep it extremely short.
    2. NO abstract philosophy unless difficulty is "hard".
    3. Conversational but distinct. Use varied phrasing.
    4. AVOID starting hints with "It's a...", "This is...", or "It has...". Start with verbs or vibes.
    
    DIFFICULTY ADJUSTMENT:
    - Easy: Describe physical traits or common uses directly.
    - Medium: Use analogies or vibes.
    - Hard: Be cryptic.

    CONTEXT (Do not repeat these exact phrasings or ideas):
    ${context.join("\n")}
    `;

    // Try OpenAI first
    const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY && OPENAI_API_KEY !== "your_openai_api_key_here") {
      try {
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Give a fresh, unique hint about ${topic}. Ensure it is different from previous ones and in ${isArabic ? 'Arabic' : 'English'}.` }
          ],
          temperature: 1.0,
        });
        const text = response.choices[0].message.content?.trim();
        return res.status(200).json({ text });
      } catch (error) {
        console.warn("OpenAI error, falling back to Gemini:", error);
      }
    }

    // Fallback to Gemini
    const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "PLACEHOLDER_API_KEY") {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { temperature: 1.0 },
        systemInstruction: systemInstruction.replace('CONTEXT', 'PREVIOUS MESSAGES')
      });
      const result = await model.generateContent(`Give a fresh, unique hint about ${topic}. Ensure it is different from previous ones and in ${isArabic ? 'Arabic' : 'English'}.`);
      const text = result.response.text().trim();
      return res.status(200).json({ text });
    }

    return res.status(500).json({ error: 'No API keys configured' });
  } catch (error) {
    console.error('Error generating banter:', error);
    return res.status(500).json({ error: 'Failed to generate banter' });
  }
}
