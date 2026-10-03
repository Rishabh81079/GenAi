import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import readline from "readline-sync"
dotenv.config();

const api = process.env.API_GEMINI;



const ai = new GoogleGenAI({
  apiKey: api
});



// INTERACTION WITH GEMINI TO CREATE OUTPUT
// async function main() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-2.5-flash",
//     input: "How does AI work?",
//   });
//   console.log(interaction.output_text);
  
// }

// await main();


//CONTENT IS USED TO GIVE CONTEXT OR MANUAL HISTORY
// async function main(){
// const context = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//  contents: [
//   {
//     role: "user",
//     parts: [
//       { text: "My name is RJ." }
//     ]
//   },

//   {
//     role: "model",
//     parts: [
//       { text: "Nice to meet you, RJ!" }
//     ]
//   },

//   {
//     role: "user",
//     parts: [
//       { text: "What is my name?" }
//     ]
//   }
// ]
// });

// console.log(context.text); 
// }

// await main();


//SYSTEM INSTRUCTION IS USED TO GIVE STRICT INSTRUCTIONS 
// async function main() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "what is 2+2 with capital of india ",
//     system_instruction: `You are a math tutor 
//     Strict Rule to Follow
//     - you will only answer the question which is related to math equations 
//     - dont answer anything which is not related to math
//     - rudely reply to user if they ask question which is not related to math
//     `,
    
//   });
//   console.log(interaction.output_text);
// }

// await main();


//Ask Question in Console
// async function main() {

//   const question = readline.question("Hello, What is your Question?\n");

//   const interaction = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: `${question} `,
    
//        system_instruction: `You are a math tutor 
//     Strict Rule to Follow
//     - you will only answer the question which is related to math equations 
//     - dont answer anything which is not related to math
//     - rudely reply to user if they ask question which is not related to math
//     ` 
//       ,
    
//   });
//   console.log(interaction.output_text);
// }

// await main();


//GIVE ANSWER IN CHUNKS
async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works",
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

await main();


