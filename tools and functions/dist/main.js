var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import PromptSync from "prompt-sync";
const genAi = new GoogleGenAI({});
const askAI = () => __awaiter(void 0, void 0, void 0, function* () {
    const chat = genAi.chats.create({
        model: "gemini-1.5-flash",
        history: [],
    });
    while (true) {
        const input = PromptSync({ sigint: true });
        const message = input({});
        try {
            const response = yield chat.sendMessage({
                message
            });
            const ans = response.candidates[0].content.parts[0].text;
            console.log(ans);
        }
        catch (error) {
            console.log(error);
            break;
        }
        if (message == "exit") {
            break;
        }
    }
});
askAI();
