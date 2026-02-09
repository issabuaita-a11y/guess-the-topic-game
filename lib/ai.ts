import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("API Key Loaded:", API_KEY ? "Yes (starts with " + API_KEY.substring(0, 4) + ")" : "No");
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateNewTopic(difficulty: string, recentTopics: string[] = [], language: 'en' | 'ar' = 'en') {
    if (!API_KEY || API_KEY === "PLACEHOLDER_API_KEY") return null;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const isArabic = language === 'ar';
    const prompt = `Generate a random, distinct object for a deduction game.
  Difficulty: "${difficulty}"
  Language: "${isArabic ? 'Arabic' : 'English'}"

  CRITICAL RULES:
  1. DO NOT generate generic "Adjective Noun" pairs like "Red Apple", "Blue Ball", "Green Tree".
  2. DO NOT use colors in the topic name unless it is intrinsic (e.g., "Redwood Tree").
  3. Topics must be specific, tangible objects or well-known concepts.
  4. DO NOT REPEAT any of these recently used topics: ${recentTopics.join(", ")}.
  5. The topic must be DIFFERENT and VARIANT from the list above. Be creative.
  ${isArabic ? '6. EVERYTHING must be in Arabic script.' : ''}

  GUIDELINES:
  - If difficulty is "easy": Pick common, distinct household items or retro tech (e.g., "Toaster", "Skateboard", "Vinyl Record", "Cactus", "Espresso").
  - If difficulty is "medium": Pick broader concepts or slightly less common objects (e.g., "Nostalgia", "Satellite", "Polaroid", "Bonsai").
  - If difficulty is "hard": Pick abstract concepts or very specific niche items (e.g., "Entropy", "Quantum", "Synthesizer").

  Return a JSON object with strictly ONE topic and THREE distractors (the distractors should also be distinct and plausible):
  {
    "label": "The Topic Name (in ${isArabic ? 'Arabic' : 'English'})",
    "distractors": ["Wrong Topic 1", "Wrong Topic 2", "Wrong Topic 3"] (all in ${isArabic ? 'Arabic' : 'English'})
  }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        console.log("Gemini Raw Response:", text);

        // Remove markdown code blocks if present
        text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

        return JSON.parse(text) as { label: string; distractors: string[] };
    } catch (error) {
        console.error("Gemini Topic Error:", error);
        return null;
    }
}

export async function generateBotBanter(topic: string, botName: string, botStyle: string, context: string[], difficulty: string, language: 'en' | 'ar' = 'en') {
    if (!API_KEY || API_KEY === "PLACEHOLDER_API_KEY") return null;

    const isArabic = language === 'ar';
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are ${botName} in a cozy isometric room.
    Target Topic: "${topic}" (provided in ${isArabic ? 'Arabic' : 'English'})
    Your Personality: ${botStyle}
    Game Difficulty: ${difficulty}
    Language: ${isArabic ? 'Arabic' : 'English'}

    OBJECTIVE: Give a hint about the topic without saying it. Respond ONLY in ${isArabic ? 'Arabic' : 'English'}.

    STRICT CONSTRAINTS:
    1. MAX 4 WORDS per message (or equivalent in Arabic). Keep it extremely short.
    2. NO abstract philosophy unless difficulty is "hard".
    3. Conversational but distinct.
    
    DIFFICULTY ADJUSTMENT:
    - Easy: Describe physical traits or common uses directly.
    - Medium: Use analogies or vibes.
    - Hard: Be cryptic.

    CONTEXT (Do not repeat these):
    ${context.join("\n")}
    `,
    });

    try {
        const result = await model.generateContent(`Give a fresh, unique hint about ${topic}. Ensure it is different from previous ones and in ${isArabic ? 'Arabic' : 'English'}.`);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Banter Error:", error);
        return null;
    }
}
