import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import PromptSync from "prompt-sync";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

async function runChat() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [],
    });
    const input = PromptSync({ sigint: true });

    while (true) {
      const msg = input({});

      const result = await chat.sendMessage(msg);

      const response = result.response.candidates![0].content.parts[0].text;
      console.log(response);

      if (msg == "exit") break;
    }
  } catch (error) {
    console.log(error);
  }
}

runChat();
