import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import readline from "readline-sync"
dotenv.config();

const api = process.env.API_GEMINI;
const coin_api = process.env.API_COIN; 


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
// async function main() {
//   const response = await ai.models.generateContentStream({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works",
//   });

//   for await (const chunk of response) {
//     console.log(chunk.text);
//   }
// }

// await main();


// //HISTORY - THERE IS NO NEED TO MANUALLY ADD HISTORY
// async function main() {
//   const chat = ai.chats.create({
//     model: "gemini-3.8-flash",
//     history: [
//       {
//         role: "user",
//         parts: [{ text: "Hello" }],
//       },
//       {
//         role: "model",
//         parts: [{ text: "Great to meet you. What would you like to know?" }],
//       },
//     ],
//   });

//   const response1 = await chat.sendMessage({
//     message: "I have 2 dogs in my house.",
//   });
//   console.log("Chat response 1:", response1.text);

//   const response2 = await chat.sendMessage({
//     message: "How many paws are in my house?",
//   });
//   console.log("Chat response 2:", response2.text);
// }

// await main();




//HISTORY + Input from User until exit
// async function main() {
//   const chat = ai.chats.create({
//     model: "gemini-2.5-flash",
//     history: [],
//   });

//   while(true){
//     console.log(" type 'exit' if you want to exit ");
//     const question = readline.question("ask your question:");
    
//     if(question == "exit"){
//       break;
//     }
//     const response = await chat.sendMessage({
//       message:question
//     })
//     console.log(response.text);
    
//   }

  
// }
// await main();



//JS
// async function crypto(coin){
//   const response = await fetch(`${coin_api}${coin}`)
//   const data = response.json();
//   return data;
// }

// console.log(await crypto("bitcoin"));


//LLM with Tools in server
// crypto currency tool
async function cryptoCurrency({coin}) {

  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
  const data = await response.json();
  return data;
}

// weather tool

async function weatherInformation({city}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=d6a3bcd7a43c4ed59c2155208252404&q=${city}&aqi=no`);
    const data = await response.json();

    return data;
}






const cryptoInfo = {
    name:"cryptoCurrency",
    description: "We can give you the current price or other information related to cryptocurrency like bitcoin and ethereum etc",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin:{
                type:Type.STRING,
                description: "It will be the name of the cryptocurrency like bitcoin, ethereum, etc"
            }
        },
        required:['coin']
    }
}


const weatherInfo = {
    name: "weatherInformation",
    description: "You can get the current weather information of any city like london, goa etc",
    parameters:{
        type:Type.OBJECT,
        properties:{
            city:{
                type:Type.STRING,
                description:"Name of the city for which I have to fetch weather information like london, goa etc"
            }
        },
        required:['city']
    }
}


const tools = [{
    functionDeclarations: [cryptoInfo,weatherInfo]
}];


const toolFunctions = {
    "cryptoCurrency": cryptoCurrency,
    "weatherInformation":weatherInformation
}

const History = [];


async function runAgent() {
  

    while(true){

        const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
        config: { tools },
       });
       
       if (result.functionCalls && result.functionCalls.length > 0){
        
        console.log("My function is called");
        const functionCall = result.functionCalls[0];

        const {name,args} = functionCall;


        const response = await toolFunctions[name](args);

        const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: response,
            },
        };


        // Send the function response back to the model.
       History.push({
       role: "model",
        parts: [{functionCall: functionCall}],
        });

        History.push({
            role:'user',
            parts:[{functionResponse: functionResponsePart}]
        })
       }
       else{
        History.push({
            role:'model',
            parts:[{text:result.text}]
        });
        console.log(result.text);
        break;
       } 

    }
}


while(true){
    
    const question = readline.question('Ask me anything: ');

    if(question == 'exit'){
        break;
    }

    History.push({
        role:'user',
        parts:[{text:question}]
    });

    await runAgent();
}








