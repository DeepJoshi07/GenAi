import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import PromptSync from "prompt-sync";

const genAi = new GoogleGenAI({});

const askAI = async () => {
  const chat = genAi.chats.create({
    model: "gemini-1.5-flash",
    history: [],
  });

  while (true) {
    const input = PromptSync({ sigint: true });
    const message = input({})

    try {
      const response = await chat.sendMessage({
        message
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
askAI();
