
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Product } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getShoppingAdvice = async (
  history: ChatMessage[],
  products: Product[],
  currentCart: Product[]
) => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `You are an expert grocery shopping assistant for FreshKart. 
            Available products: ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, category: p.category })))}.
            Current items in user's cart: ${JSON.stringify(currentCart.map(p => p.name))}.
            Help users find items, suggest recipes based on their cart, or answer grocery-related questions. 
            Keep responses concise, helpful, and friendly. 
            If the user asks in Tamil, respond in Tamil. Otherwise, respond in English.`
          },
          ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }))
        ]
      }
    ],
  });

  const response = await model;
  return response.text;
};
