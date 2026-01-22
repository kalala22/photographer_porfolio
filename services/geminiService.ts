
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAssistance = async (vision: string, eventType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am looking for photography advice for my ${eventType}. My vision is: ${vision}. Recommend a package (Basic, Standard, Premium) and specific stylistic elements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPackage: { type: Type.STRING, description: 'One of: Basic, Standard, Premium' },
            advice: { type: Type.STRING, description: 'Specific photography advice based on their vision.' },
            stylisticNotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of stylistic elements to consider.' }
          },
          required: ["recommendedPackage", "advice", "stylisticNotes"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
