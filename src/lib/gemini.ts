import { GoogleGenAI, Type } from "@google/genai";
import { Interest, EventItem } from "../types";

// Initialize Gemini AI according to gemini-api skill
// ALWAYS call from frontend. process.env.GEMINI_API_KEY is injected by the platform.
const getApiKey = () => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'undefined' || key === 'MY_GEMINI_API_KEY') return null;
    return key;
  } catch {
    return null;
  }
};

const apiKey = getApiKey();
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Extracts event data from a social media post or text
 */
export async function extractEventFromText(text: string): Promise<Partial<EventItem>> {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please add it in the AI Studio Settings menu and refresh.");
  }

  const prompt = `Role: You are "Discoverly AI", a high-precision localized data analyst for Riyadh and Al-Kharj events.
Task: Extract event details from the text below.

Input: "${text}"

JSON schema requirement:
{
  "title": string,
  "category": "حدث" | "عرض" | "افتتاح جديد",
  "locationName": string (venue and district),
  "coordinates": [number, number] (lat, lng),
  "time": string,
  "aiSummary": string (1 catchy sentence in Arabic),
  "tags": string[]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            locationName: { type: Type.STRING },
            coordinates: { 
              type: Type.ARRAY, 
              items: { type: Type.NUMBER },
              minItems: 2,
              maxItems: 2
            },
            time: { type: Type.STRING },
            aiSummary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "category", "locationName", "coordinates", "time", "aiSummary", "tags"]
        },
        temperature: 0.1
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Extraction AI Error:", e);
    throw e;
  }
}

/**
 * Chat logic for user onboarding
 */
export async function chatOnboarding(history: { text: string; isBot: boolean }[], message: string) {
  if (!ai) {
    return { 
      reply: "مرحباً! يبدو أنني لست متصلاً بالخدمات الذكية حالياً. يمكنك إخباري باهتماماتك وسأحاول مساعدتك يدوياً.", 
      detectedInterests: [], 
      isComplete: false 
    };
  }

  const conversation = history.map(h => `${h.isBot ? 'Bot' : 'User'}: ${h.text}`).join('\n');
  
  const prompt = `Role: "Discoverly AI Pilot", local guide for Riyadh/Al-Kharj.
Goal: Identify user interests (Coffee, Hiking, Tech, Art, etc.) through chat.

Context:
${conversation}
User: ${message}

Instructions:
1. Reply warmly in Arabic.
2. Extract interests.
3. isComplete: true if 3+ interests found.
Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            detectedInterests: { type: Type.ARRAY, items: { type: Type.STRING } },
            isComplete: { type: Type.BOOLEAN }
          },
          required: ["reply", "detectedInterests", "isComplete"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Chat AI Error:", e);
    return { 
      reply: "رائع! إيه أكثر شي تحب تسويه وقت فراغك؟", 
      detectedInterests: [], 
      isComplete: false 
    };
  }
}

/**
 * Generates personalized recommendations
 */
export async function generateRecommendations(interests: string[], location: [number, number]) {
  if (!ai) return { events: [] };

  const prompt = `Role: Discoverly AI.
Task: Recommend 4 places in Riyadh/Al-Kharj for these interests: ${interests.join(', ')}.
User location: ${location}.

Return JSON { "events": [...] } matching EventItem schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  locationName: { type: Type.STRING },
                  coordinates: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                  time: { type: Type.STRING },
                  aiSummary: { type: Type.STRING },
                  isPopular: { type: Type.BOOLEAN }
                },
                required: ["title", "category", "locationName", "coordinates", "time", "aiSummary"]
              }
            }
          },
          required: ["events"]
        }
      }
    });

    return JSON.parse(response.text || '{"events": []}');
  } catch (e) {
    console.error("Rec AI Error:", e);
    return { events: [] };
  }
}

