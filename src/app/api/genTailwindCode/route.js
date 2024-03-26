import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  const reqBody = await NextRequest.json();
  const { context, query, theme } = reqBody;

  let lastAssistantCode = (context || [])
    .filter((x) => x.type === "assistant")
    .slice(-1)
    .pop();

  if (lastAssistantCode) {
    lastAssistantCode = lastAssistantCode.message;
  }

  // console.log(lastAssistantCode);

  // let UserQueryTillNow = [];

  // for (const item of context) {
  //   if (item.message && item.type === "user") {
  //     UserQueryTillNow.push(item.message);
  //   }
  // }

  const userMessage = query.split(" ").slice(0, 500).join(" ");

  let messages = [];

  messages.push({
    role: "user",
    content: userMessage,
  });

  if (messages.length === 1) {
    messages = messages.map((message) => {
      if (message.role === "user") {
        return {
          role: "user",
          content: `Give me HTML code in Tailwind CSS for

${message.content}

The theme uses ${theme.primaryColor} as primary color and ${
            theme.secondaryColor
          } as secondary color.

          ${
            lastAssistantCode
              ? `Here's the code written so far: \n ${lastAssistantCode}`
              : ``
          }



Return pure HTML code (in tailwind CSS framework). If you are not able to generate HTML code, don't return anything. Your response must start with the HTML code and should not have any other text. Do not start with "Sure, here's...". Do not write anything but HTML code. Don't explain your code. Don't end your answer with explanation. Don't greet. Your response will directly be used to render HTML. Aim for making the HTML beautiful and stick to my input as much as possible.`,
        };
      } else {
        return message;
      }
    });
  }

  let botResponse = "";

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    botResponse = completion.choices[0].message.content;
  } catch (e) {
    botResponse = "I am not able to generate HTML code. Please try again.";
    console.log(e);
  }

  // if the botResponse has ``` at the start or end, remove them
  if (botResponse.startsWith("```html")) {
    botResponse = botResponse.slice(7);
  }
  // //   if (botResponse.startsWith("```")) {
  // //     botResponse = botResponse.slice(3);
  // //   }
  if (botResponse.endsWith("```")) {
    botResponse = botResponse.slice(0, -3);
  }
  // check if the botResponse has ```html at some text, remove everything till ```html including that portion
  if (botResponse.includes("```html")) {
    botResponse = botResponse.slice(botResponse.indexOf("```html") + 7);
  }
  if (botResponse.includes("```")) {
    botResponse = botResponse.slice(botResponse.indexOf("```") + 3);
  }

  // if there is ``` followed by some text, then remove ``` and the text following it
  if (botResponse.includes("```")) {
    botResponse = botResponse.split("```")[0];
  }

  return NextResponse.json({
    message: "success",
    data: botResponse,
    success: true,
  });
}
