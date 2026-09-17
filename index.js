import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.API_GEMINI;



const ai = new GoogleGenAI({
  apiKey: api
});

// const interaction = await ai.interactions.create({
//   model: "gemini-3.8-flash",
//    input: "Explain how AI works in a few words",
//   contents:[{
//     role:"user",
//     parts:"how are you"
//   }]
// });

// console.log(interaction.output_text); 



const interaction = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents:[{
    role:"user",
    parts:[
      {
        text:"how are you"
      }
    ]
  }]
});


console.log(interaction.text); 