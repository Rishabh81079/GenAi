import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.API_GEMINI;



const ai = new GoogleGenAI({
  apiKey: api
});

// async function main() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-2.5-flash",
//     input: "How does AI work?",
//   });
//   console.log(interaction.output_text);
// }

// const result = await main();
// console.log(result);


async function main(){
const context = await ai.models.generateContent({
  model: "gemini-2.5-flash",
 contents: [
  {
    role: "user",
    parts: [
      { text: "My name is RJ." }
    ]
  },

  {
    role: "model",
    parts: [
      { text: "Nice to meet you, RJ!" }
    ]
  },

  {
    role: "user",
    parts: [
      { text: "What is my name?" }
    ]
  }
]
});

console.log(context.text); 
}

await main();