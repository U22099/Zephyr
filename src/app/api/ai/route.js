import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function chat(name, history, msg, settings) {
  // Create a new Google Generative AI instance using the API key from environment variables.
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_AI_API_KEY);
  // Get the Gemini model.  System instruction sets the model's behavior.
  const model = genAI.getGenerativeModel({
    model: settings.modelType === "fast" ? "gemini-1.5-flash-8b" : "gemini-1.5-pro",
    generationConfig: {
      temperature: (settings.temperature / 50).toFixed(1)
    },
    systemInstruction: "You are an AI chatbot embeded in a chat app called zephyr created by a 17 years old MERN + Nextjs Stack Developer named Daniel"
  });

  // Start a new chat session with the existing chat history.
  const chat = model.startChat({ history });
  //Creating a good prompt
  const prompt = `
  My name is: ${name};
  And here's a little bit of info about me: ${settings.info};
  I want you to act as stated below: ${settings.behavior};
  Generate a clear and concise response to this text prompt: ${msg.parts[0].text};`;

  try {
    // Send the message to the chat model and await the response.
    const result = await chat.sendMessage(prompt);
    // Extract the text from the response.
    const response = result.response.text();
    return response;
  } catch (e) {
    console.error(e.message); // Log the error message to the console.
    return false; // Return false to indicate an error.
  }
}

export const POST = async (req) => {
  try {
    const { data, history, name, settings } = await req.json();
    const res = await chat(name, history, data, settings);
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}