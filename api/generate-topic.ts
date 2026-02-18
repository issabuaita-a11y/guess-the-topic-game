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
    const { difficulty, recentTopics = [], language = 'en' } = req.body;

    if (!difficulty) {
      return res.status(400).json({ error: 'Difficulty is required' });
    }

    const isArabic = language === 'ar';
    
    // EXACT PROMPT FROM YOUR WORKING CODE
    const prompt = `Generate a random, distinct object for a deduction game.
  Difficulty: "${difficulty}"
  Language: "${isArabic ? 'Arabic' : 'English'}"

  CRITICAL RULES:
  1. Keep topics SHORT - 1-2 words maximum.
  2. DO NOT generate generic "Adjective Noun" pairs like "Red Apple", "Blue Ball", "Green Tree".
  3. DO NOT use colors in the topic name unless it is intrinsic (e.g., "Redwood").
  4. Topics must be specific, tangible objects or well-known concepts.
  5. DO NOT REPEAT any of these recently used topics: ${recentTopics.join(", ")}.
  6. The topic must be DIFFERENT from the list above. Be creative but accessible.
  7. Avoid repetitive categories. If the list has tech, try nature. If it has nature, try food or household items.
  ${isArabic ? '8. EVERYTHING must be in Arabic script.' : ''}

  DIFFICULTY GUIDELINES (VERY IMPORTANT):
  - If difficulty is "easy": Pick EXTREMELY COMMON everyday items that a 5-year-old would know. Examples: "Chair", "Spoon", "Apple", "Car", "Book", "Cup", "Door", "Window", "Ball", "Shoe". Keep it SIMPLE.
  - If difficulty is "medium": Pick common items or well-known objects (e.g., "Guitar", "Camera", "Bicycle", "Pizza", "Laptop", "Backpack").
  - If difficulty is "hard": Pick less common or abstract concepts (e.g., "Telescope", "Compass", "Parachute", "Microscope", "Antenna").

  Return a JSON object with a SHORT topic (1-2 words) and THREE short distractors (same length, distinct and plausible):
  {
    "label": "TopicName (in ${isArabic ? 'Arabic' : 'English'})",
    "distractors": ["Wrong1", "Wrong2", "Wrong3"] (all in ${isArabic ? 'Arabic' : 'English'})
  }`;

    // Try OpenAI first
    const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY && OPENAI_API_KEY !== "your_openai_api_key_here") {
      try {
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.9,
        });
        const text = response.choices[0].message.content || "{}";
        const data = JSON.parse(text);
        return res.status(200).json(data);
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
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9,
        }
      });
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      const data = JSON.parse(text);
      return res.status(200).json(data);
    }

    return res.status(500).json({ error: 'No API keys configured' });
  } catch (error) {
    console.error('Error generating topic:', error);
    return res.status(500).json({ error: 'Failed to generate topic' });
  }
}
