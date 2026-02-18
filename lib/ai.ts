// Secure API endpoint configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function generateNewTopic(difficulty: string, recentTopics: string[] = [], language: 'en' | 'ar' = 'en') {
    try {
        console.log("Calling secure backend API for topic generation...");
        const response = await fetch(`${API_BASE_URL}/generate-topic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                difficulty,
                recentTopics,
                language
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend API success:", data);
        return data as { label: string; distractors: string[] };
    } catch (error) {
        console.error("Backend API Error:", error);
        return null;
    }
}

export async function generateBotBanter(topic: string, botName: string, botStyle: string, context: string[], difficulty: string, language: 'en' | 'ar' = 'en') {
    try {
        console.log("Calling secure backend API for banter generation...");
        const response = await fetch(`${API_BASE_URL}/generate-banter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic,
                botName,
                botStyle,
                context,
                difficulty,
                language
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend API banter success");
        return data.text || null;
    } catch (error) {
        console.error("Backend API Banter Error:", error);
        return null;
    }
}
