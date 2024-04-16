import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import axios from "axios";

export async function POST(NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  const reqBody = await NextRequest.json();
  const { htmlCode, exportTo } = reqBody;

  let messages = [];
  messages.push({
    role: "user",
    content: `Give me ${exportTo} code by converting the following HTML code ${htmlCode}


     Return pure ${exportTo} code. If you are not able to generate the code, don't return anything. Your response must start with the code and should not have any other text. Do not start with "Sure, here's...". Do not write anything but ${exportTo} code. Don't explain your code. Don't end your answer with explanation. Don't greet. Your response will directly be used to render HTML. Aim for making the HTML beautiful and stick to my input as much as possible.`,
  });

  let botResponse = "";

  // try {
  //   const completion = await openai.chat.completions.create({
  //     messages,
  //     model: "gpt-3.5-turbo",
  //   });

  //   botResponse = completion.choices[0].message.content;
  // } catch (e) {
  //   botResponse = "I am not able to generate the code. Please try again.";
  //   console.log(e, "this is the error");
  // }

  try {
    const data = {
      model: "llama2",
      prompt: messages[0].content,
      stream: false,
    };
    const res = await axios.post(process.env.API_URL, data);

    botResponse = res.data.response;
  } catch (e) {
    botResponse = "I am not able to generate HTML code. Please try again.";
    console.log(e);
  }

  if (botResponse.startsWith("```jsx")) {
    botResponse = botResponse.slice(7);
  }
  if (botResponse.startsWith("```")) {
    botResponse = botResponse.slice(3);
  }
  if (botResponse.endsWith("```")) {
    botResponse = botResponse.slice(0, -3);
  }

  if (botResponse.includes("```jsx")) {
    botResponse = botResponse.slice(botResponse.indexOf("```html") + 7);
  }
  if (botResponse.includes("```")) {
    botResponse = botResponse.slice(botResponse.indexOf("```") + 3);
  }

  return NextResponse.json({
    message: "success",
    data: botResponse,
    success: true,
  });
}
