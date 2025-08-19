import {
  createUserContent,
  createPartFromUri,
  GoogleGenAI,
  Type,
} from "@google/genai";
import { fetchWeatherApi } from "openmeteo";
import axios from "axios";
import "dotenv/config";
import PromptSync from "prompt-sync";

const genAi = new GoogleGenAI({});

// have a chat with ai [keeping history]
const askAI = async () => {
  const chat = genAi.chats.create({
    model: "gemini-1.5-flash",
    history: [],
  });

  while (true) {
    const input = PromptSync({ sigint: true });
    const message = input({});

    try {
      const response = await chat.sendMessage({
        message,
      });
      const ans = response.candidates![0].content!.parts![0].text;
      console.log(ans);
    } catch (error) {
      console.log(error);
      break;
    }
    if (message == "exit") {
      break;
    }
  }
};
// askAI() about Image;

// asking ai to tell or rather anylize image
const askAIfromImg = async () => {
  const image = await genAi.files.upload({
    file: "src/assets/peocock.jpg",
  });
  const response = await genAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      createUserContent([
        "tell me about this image",
        createPartFromUri(image.uri!, image.mimeType!),
      ]),
    ],
  });
  console.log(response.text);
};
// askAIfromImg();

// giving ai a role like teacher,worker etc.
const yourRole = async () => {
  const response = await genAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "what is th prob in thiz sentance?",
    config: {
      systemInstruction: "you are english teacher.",
    },
  });
  console.log(response.text);
};
// yourRole();

// streaming response
const streamResponse = async () => {
  const response = await genAi.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "what is llm in 250 words.",
  });
  for await (const chunks of response) {
    console.log(chunks.text);
  }
};

// await streamResponse();

// tools and functions

const ai = new GoogleGenAI({});

const get_current_temperature = async(argument:any)=>{
  const cityName = argument.location;
  if(cityName == "ahmedabad"){
    return "25degree"
  }
  if(cityName == "rajkot"){
    return "30degree"
  }
   if(cityName == "gandhinagar"){
    return "20degree"
  }
}

const weatherFunctionDeclaration = {
  name: 'get_current_temperature',
  description: 'Gets the current temperature for a given location.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: 'The city name, e.g. San Francisco',
      },
    },
    required: ['location'],
  },
};

// Send request with function declarations
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "What's the temperature in gandhinagar?",
  config: {
    tools: [{
      functionDeclarations: [weatherFunctionDeclaration]
    }],
  },
});


if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0]; // Assuming one function call
  console.log(`Function to call: ${functionCall.name}`);
  console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
  // In a real app, you would call your actual function here:
  const result = await get_current_temperature(functionCall.args);
  console.log(result);
} else {
  console.log("No function call found in the response.");
  console.log(response.text);
}