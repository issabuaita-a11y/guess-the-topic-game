import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Initialize Clients
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateNewTopic(difficulty: string, recentTopics: string[] = [], language: 'en' | 'ar' = 'en') {
    const isArabic = language === 'ar';
    const prompt = `Generate a random, distinct object for a deduction game.
  Difficulty: "${difficulty}"
  Language: "${isArabic ? 'Arabic' : 'English'}"

  CRITICAL RULES:
  1. TOPIC MUST BE EXACTLY ONE WORD. NO EXCEPTIONS.
  2. DO NOT generate generic "Adjective Noun" pairs like "Red Apple", "Blue Ball", "Green Tree".
  3. DO NOT use colors in the topic name unless it is intrinsic (e.g., "Redwood").
  4. Topics must be specific, tangible objects or well-known concepts.
  5. DO NOT REPEAT any of these recently used topics: ${recentTopics.join(", ")}.
  6. The topic must be DIFFERENT and MULTI-DIMENSIONAL from the list above. Be creative.
  7. Avoid repetitive categories. If the list has tech, try nature. If it has nature, try architecture or mythology.
  ${isArabic ? '8. EVERYTHING must be in Arabic script.' : ''}

  GUIDELINES:
  - If difficulty is "easy": Pick common, distinct household items, retro tech, or iconic foods (e.g., "Toaster", "Skateboard", "Cactus", "Sushi").
  - If difficulty is "medium": Pick broader concepts, slightly less common objects, or specialized tools (e.g., "Nostalgia", "Satellite", "Polaroid", "Bonsai", "Sextant").
  - If difficulty is "hard": Pick abstract concepts, obscure historical items, or very specific scientific/niche terms (e.g., "Entropy", "Astrolabe", "Synthesizer", "Bioluminescence", "Tesseract").

  Return a JSON object with strictly ONE word topic and THREE one word distractors (the distractors should also be distinct and plausible):
  {
    "label": "SingleWordTopic (in ${isArabic ? 'Arabic' : 'English'})",
    "distractors": ["WrongWord1", "WrongWord2", "WrongWord3"] (all in ${isArabic ? 'Arabic' : 'English'})
  }`;

    // 1. Try OpenAI First
    if (OPENAI_API_KEY && OPENAI_API_KEY !== "your_openai_api_key_here") {
        try {
            console.log("Attempting OpenAI Topic Generation...");
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.9,
            });
            const text = response.choices[0].message.content || "{}";
            console.log("OpenAI success:", text);
            return JSON.parse(text) as { label: string; distractors: string[] };
        } catch (error) {
            console.warn("OpenAI Topic Error, falling back to Gemini:", error);
        }
    }

    // 2. Fallback to Gemini
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "PLACEHOLDER_API_KEY") {
        try {
            console.log("Attempting Gemini Topic Generation...");
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.9,
                }
            });
            const result = await model.generateContent(prompt);
            let text = result.response.text().trim();
            // Clean markdown
            text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            console.log("Gemini success:", text);
            return JSON.parse(text) as { label: string; distractors: string[] };
        } catch (error) {
            console.error("Gemini Topic Error:", error);
        }
    }

    return null;
}

export async function generateBotBanter(topic: string, botName: string, botStyle: string, context: string[], difficulty: string, language: 'en' | 'ar' = 'en') {
    const isArabic = language === 'ar';
    const systemInstruction = `You are ${botName} in a cozy isometric room.
    Target Topic: "${topic}" (provided in ${isArabic ? 'Arabic' : 'English'})
    Your Personality: ${botStyle}
    Game Difficulty: ${difficulty}
    Language: ${isArabic ? 'Arabic' : 'English'}

    OBJECTIVE: Give a hint about the topic without saying it. Respond ONLY in ${isArabic ? 'Arabic' : 'English'}.

    STRICT CONSTRAINTS:
    1. MAX 4 WORDS per message (or equivalent in Arabic). Keep it extremely short.
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

    // 1. Try OpenAI First
    if (OPENAI_API_KEY && OPENAI_API_KEY !== "your_openai_api_key_here") {
        try {
            console.log("Attempting OpenAI Banter...");
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: `Give a fresh, unique hint about ${topic}. Ensure it is different from previous ones and in ${isArabic ? 'Arabic' : 'English'}.` }
                ],
                temperature: 1.0,
            });
            return response.choices[0].message.content?.trim() || null;
        } catch (error) {
            console.warn("OpenAI Banter Error, falling back to Gemini:", error);
        }
    }

    // 2. Fallback to Gemini
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "PLACEHOLDER_API_KEY") {
        try {
            console.log("Attempting Gemini Banter...");
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: { temperature: 1.0 },
                systemInstruction: systemInstruction.replace('CONTEXT', 'PREVIOUS MESSAGES') // Minor adjustment to differentiate
            });
            const result = await model.generateContent(`Give a fresh, unique hint about ${topic}. Ensure it is different from previous ones and in ${isArabic ? 'Arabic' : 'English'}.`);
            return result.response.text().trim();
        } catch (error) {
            console.error("Gemini Banter Error:", error);
        }
    }

    return null;
}
