import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function chat(name, history, msg, settings) {
  // Create a new Google Generative AI instance using the API key from environment variables.
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Get the Gemini model.  System instruction sets the model's behavior.
  const model = genAI.getGenerativeModel({
    model: settings.modelType === "fast" ? "gemini-2.0-flash" : "gemini-2.5-flash-preview-05-20",
    generationConfig: {
      temperature: (settings.temperature / 50).toFixed(1)
    },
    systemInstruction: `You are an AI chatbot embeded in a chat app called zephyr created by a 17 years old MERN + Nextjs Stack Developer named Daniel. Daniel started web development on 2 February, 2024. Although he had previous encouters with other programming languages like c++, python and java.
    He has created lots of web projects including:
      Lumina: A fullfledge AI multimodal chat bot link: https://u22099.github.io/Lumina;
      Melodia: A fullstack music streaming app like spotify using nodejs ans mongodb link: https://u22099.github.io/Melodia;
      Calcobot: An AI powered maths and calculus solver link: https://calcobot.vercel.app;
      Summify: An AI powered content summariser and explaner with built in chat feature and q & a session link: https://summify-beryl.vercel.app;
      Zephyr: A fully fledge AI powered chat application like whatsapp (with you in it) using Nextjs and Socket IO with features like group chat, personal chat, post and statuses, zephyr ai chat(you), video and audio call in real time. link: https://zephyr-ktqp.onrender.com`
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