import express from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Generate Topic Endpoint
app.post('/generate-topic', async (req, res) => {
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
        return res.json(data);
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
      return res.json(data);
    }

    res.status(500).json({ error: 'No API keys configured' });
  } catch (error) {
    console.error('Error generating topic:', error);
    res.status(500).json({ error: 'Failed to generate topic' });
  }
});

// Generate Banter Endpoint
app.post('/generate-banter', async (req, res) => {
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
        return res.json({ text });
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
      return res.json({ text });
    }

    res.status(500).json({ error: 'No API keys configured' });
  } catch (error) {
    console.error('Error generating banter:', error);
    res.status(500).json({ error: 'Failed to generate banter' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /generate-topic');
  console.log('  POST /generate-banter');
});
