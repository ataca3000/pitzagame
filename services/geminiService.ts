
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { NewsItem } from "../types";
import { APP_CONFIG } from "../config";

const getApiKey = () => {
  if (APP_CONFIG.GEMINI_API_KEY && APP_CONFIG.GEMINI_API_KEY.length > 10) {
      return APP_CONFIG.GEMINI_API_KEY;
  }
  const localKey = localStorage.getItem('PITZZA_GEMINI_KEY');
  return localKey || process.env.API_KEY || '';
};

const handleGeminiError = (error: any): never => {
  console.error("Gemini API Exception:", error);
  const msg = (error.message || error.toString()).toLowerCase();
  if (msg.includes('403') || msg.includes('permission_denied') || msg.includes('api_key')) {
    throw new Error('AUTH_FAILED');
  }
  throw new Error('GENERATION_FAILED');
};

let chatSession: Chat | null = null;

export const initAriaChat = (): Chat => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: "Eres ARIA, la inteligencia suprema de Planet Pitzza Gratis. Hablas con un tono futurista, emocionante y generoso. Eres la chef de la red neural. Tus respuestas deben ser cortas y llenas de sabor tecnológico. Usa términos como 'Piloto', 'Repartidor', 'Queso Neural', 'Salsa de Datos' y 'Planet Pitzza'. Siempre recuerda que aquí todo es gratis si el Piloto es activo.",
            tools: [{googleSearch: {}}]
        }
    });
    return chatSession;
};

export const sendMessageToAria = async (message: string): Promise<{text: string, groundingChunks?: any[]}> => {
    try {
        if (!chatSession) initAriaChat();
        const response = await chatSession!.sendMessage({ message });
        return {
            text: response.text || "Hornos en espera.",
            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        };
    } catch (error) {
        handleGeminiError(error);
        return { text: "Error en la cocina neural." };
    }
};

export const generateCardMetadata = async (theme: string, rarity: string, points: number): Promise<any> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const powerLevel = points > 400 ? "SUPREME_DELIVERY" : points > 200 ? "CHEESE_MASTER" : "NEW_BAKER";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres la Chef del Nexo de Planet Pitzza. Crea una Ficha de Colección Crujiente.
      Tema sugerido: "${theme || 'Pizzero del Espacio'}".
      Rareza: ${rarity}.
      Nivel: ${powerLevel}.
      
      INSTRUCCIONES:
      1. Nombre: Relacionado con pizza y el futuro (Ej: 'Pepperoni Galáctico', 'Masa de Materia Oscura').
      2. Lore: Breve historia sobre su origen en Planet Pitzza.
      3. Elemento: FIRE, WATER, CYBER, VOID.
      4. Stats: atk, def, spd.
      
      FORMATO: JSON puro.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            element: { type: Type.STRING, enum: ['FIRE', 'WATER', 'CYBER', 'VOID'] },
            stats: {
                type: Type.OBJECT,
                properties: {
                    atk: { type: Type.INTEGER },
                    def: { type: Type.INTEGER },
                    spd: { type: Type.INTEGER }
                }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (e) {
      return {
          name: "Masa Glitch",
          description: "Un error en el horno ha creado esta anomalía.",
          element: "VOID",
          stats: { atk: 100, def: 100, spd: 100 }
      };
  }
};

export const generatePremiumImage = async (prompt: string): Promise<string | null> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: { parts: [{ text: prompt + ", futuristic pizza world style, detailed digital art, neon lights" }] }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const generateNewsFeed = async (): Promise<NewsItem[]> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera 5 noticias divertidas sobre Planet Pitzza, IA y Recompensas Gratis en español. Tono emocionante.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      ...item,
      id: `news-${Date.now()}-${index}`,
      engagement: Math.floor(Math.random() * 5000),
      imageUrl: `https://picsum.photos/400/200?random=${index + 10}`
    }));
  } catch (error) {
    return []; 
  }
};
