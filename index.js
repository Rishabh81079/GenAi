import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.API_GEMINI;



const ai = new GoogleGenAI({
  apiKey: api
});

const interaction = await ai.interactions.create({
  model: "gemini-3.8-flash",
  input: "Explain how AI works in a few words",
});

console.log(interaction.output_text); 