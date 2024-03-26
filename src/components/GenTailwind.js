"use client";
import { exampleQuery, primaryColors, secondaryColors } from "@/constants";
import Image from "next/image";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Avatar from "@mui/material/Avatar";
import { green, pink, deepOrange } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
const ariaLabel = { "aria-label": "description" };
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import DynamicJS from "@/components/DynamicJS";

const TailwindGen = () => {
  const [context, setContext] = useState([]);
  const [input, setInput] = useState("");
  const [disp, setDisp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: "Blue",
    secondaryColor: "White",
  });

  const handleGenerateCode = () => {
    setIsLoading(true);

    fetch("/api/genTailwindCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        query: input,
        theme: theme,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDisp(data.data);

          setContext([
            ...context,
            {
              type: "user",
              message: input,
            },
            {
              type: "assistant",
              message: data.data,
            },
          ]);

          // console.log(data.code, "data");

          console.log(context, "context");
          setIsLoading(false);
        } else {
          // setOutput(data.error);
        }
        setIsLoading(false);
        // hljs.highlightAll();
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  const handleCopyHTML = (txt) => {
    navigator.clipboard
      .writeText(txt)
      .then(() => {
        toast.success("Successfully copied!");
      })
      .catch((error) => {
        console.error("Unable to copy to clipboard:", error);
        alert("Failed to copy to clipboard.");
      });
  };

  const handleCopyCode = (input1, input2) => {
    const toastId = toast.loading("Copying to clipboard...");
    fetch("/api/codeInFramework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        htmlCode: input1,
        exportTo: input2,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigator.clipboard
            .writeText(data.data)
            .then(() => {
              toast.success("Successfully copied!");
              toast.dismiss(toastId);
            })
            .catch((error) => {
              console.error("Unable to copy to clipboard:", error);
            });
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleExample = (txt) => {
    setIsLoading(true);

    fetch("/api/genTailwindCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        query: txt,
        theme: theme,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDisp(data.data);

          setContext([
            ...context,
            {
              type: "user",
              message: txt,
            },
            {
              type: "assistant",
              message: data.data,
            },
          ]);

          // console.log(data.code, "data");

          console.log(context, "context");
          setIsLoading(false);
        } else {
          // setOutput(data.error);
        }
        setIsLoading(false);
        // hljs.highlightAll();
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="relative gap-5">
      <DynamicJS href="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp" />

      <div
        className="mx-auto w-3/5 h-full p-4"
        style={{ backgroundColor: "#f2f0e8" }}
      >
        <div
          className={`flex flex-col justify-center items-center ${
            context.length === 0 ? "h-[250px]" : "h-[125px]"
          }`}
          style={{ backgroundColor: "#f2f0e8" }}
        >
          <h1 className="text-4xl text-center font-serif">
            {" "}
            Generate Tailwind Components using GPT
          </h1>{" "}
          {context.length === 0 && (
            <p className="p-3 w-4/5 font-serif">
              Explain the component you want to create. Using LLMs, we generate
              and render the component. Iterate to create your perfect component
              and export the code in your favorite frameworks.
            </p>
          )}
        </div>

        {context.map((item, key) => (
          <div
            className="flex flex-col gap-1 bg-gray-300 mb-1 border-solid border-black rounded"
            style={{ backgroundColor: "#f2f0e8" }}
            id={`item_${key}`}
            key={key}
          >
            {item.type === "user" && (
              <div className="flex flex-row">
                <div className="flex-grow"></div>
                <div
                  className="flex justify-end items-center rounded-lg py-3 px-2 mb-1 shadow-md border border-solid"
                  style={{ backgroundColor: "#e8e5d7", margin: 0 }}
                >
                  <h1 className=" text-black px-5 font-serif">
                    {" "}
                    {item.message}{" "}
                  </h1>
                  <Avatar
                    sx={{ bgcolor: deepOrange[500], width: 30, height: 30 }}
                    src="broken-image.jpg"
                  />
                </div>
              </div>
            )}

            {item.type === "assistant" && (
              <div
                className="rounded-lg w-full mb-2 mx-auto shadow-md border-solid border"
                style={{ backgroundColor: "#f7f7f3" }}
              >
                <div
                  className="flex justify-start mt-4 mx-20 gap-1"
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />
                <div className="flex justify-between items-end  rounded gap-1 pt-7 px-2 py-2">
                  <div className="flex-grow"></div>

                  <div
                    className="inline-flex items-center bg-gray-300 text-sm px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleCopyHTML(item.message)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                    </svg>
                    HTML
                  </div>
                  <div
                    className="inline-flex items-center bg-gray-300 text-sm px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleCopyCode(item.message, "React")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                    </svg>
                    React
                  </div>
                  <div
                    className="inline-flex items-center bg-gray-300 text-sm px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleCopyCode(item.message, "Angular")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                    </svg>
                    Angular
                  </div>
                  <div
                    className="inline-flex items-center bg-gray-300 text-sm px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleCopyCode(item.message, "VueJs")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                    </svg>
                    VueJS
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {context.length !== 0 && (
        <div
          className="bg-green-300 h-[120px]"
          style={{ backgroundColor: "#f2f0e8" }}
        >
          {/* dummy  */}
        </div>
      )}
      <div
        className={`${
          context.length !== 0 ? "fixed bottom-0 left-0 right-0" : ""
        }  mx-auto w-3/5 flex flex-col justify-between p-3 bg-white border-solid border-2 border-yellow rounded-2xl`}
      >
        <div className="flex flex-row px-3">
          <div className="p-3 w-full border-hidden ">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1 },
                outline: "none",
              }}
              noValidate
              autoComplete="off"
              className="border-hidden"
            >
              <Input
                inputProps={ariaLabel}
                id="margin-none"
                className="border-hidden w-full"
                value={input}
                placeholder="Describe your UI to get code"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerateCode();
                  }
                }}
              />
            </Box>
          </div>
          {true && (
            <div className="flex items-center  w-1/5">
              <button
                type="submit"
                className="py-1 rounded-2xl bg-orange-500 border border-solid text-white text-sm "
                onClick={handleGenerateCode}
              >
                Generate Component
              </button>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
                onClick={handleGenerateCode}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          )}
        </div>
        {input !== "" && (
          <div className="flex flex-row gap-2 p-1 mx-5">
            <div className="flex flex-col">
              <select
                className="border border-gray-300 rounded shadow-sm text-sm p-1"
                value={theme.primaryColor}
                onChange={(e) =>
                  setTheme({
                    ...theme,
                    primaryColor: e.target.value,
                  })
                }
              >
                {primaryColors.map((color, index) => (
                  <option key={index}>{color} </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <select
                className="border border-gray-300 rounded shadow-sm text-sm p-1"
                value={theme.secondaryColor}
                onChange={(e) =>
                  setTheme({
                    ...theme,
                    secondaryColor: e.target.value,
                  })
                }
              >
                {secondaryColors.map((color, index) => (
                  <option key={index}>{color}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      {input === "" && context.length === 0 && (
        <div
          className="flex flex-col items-center justify-center mb-10 mt-8 p-5 mx-auto w-3/5 rounded-2xl border broder-solid border-black"
          style={{ backgroundColor: "#f2f0e8" }}
        >
          <h1 className="text-xl font-serif py-3">
            {" "}
            Understand and Work with Something{" "}
          </h1>
          <div className="flex flex-row items-center justify-center gap-2 ">
            <div
              className="flex flex-col items-center rounded px-1 py-2"
              style={{ backgroundColor: "#f2f0e8" }}
            >
              <div className="w-full">
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="image"
                  layout="responsive"
                  width={180}
                  height={120}
                  className="transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <label className="text-center text-sm w-full mt-2 font-serif">
                Generate components by describing in plain text
              </label>
            </div>

            <div
              className="flex flex-col items-center rounded px-1 py-2"
              style={{ backgroundColor: "#f2f0e8" }}
            >
              <div className="w-full">
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="image"
                  layout="responsive"
                  width={180}
                  height={120}
                  className="transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <label className="text-center text-sm w-full mt-2 font-serif">
                Iterate on the component to get the perfect design
              </label>
            </div>
            <div
              className="flex flex-col items-center rounded px-1 py-2"
              style={{ backgroundColor: "#f2f0e8" }}
            >
              <div className="w-full">
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="image"
                  layout="responsive"
                  width={180}
                  height={120}
                  className="transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <label className="text-center text-sm w-full mt-2 font-serif">
                Copy the component code in all popular JS frameworks
              </label>
            </div>
          </div>
        </div>
      )}

      {context.length === 0 && (
        <Divider className="text-sm font-serif">Some Examples for You</Divider>
      )}

      {context.length === 0 &&
        exampleQuery.map((item) => (
          <div
            className="flex flex-col hover:bg-gray-200 items-center justify-center mt-8 p-5 mx-auto w-3/6 rounded-2xl border broder-solid border-black  "
            // style={{ backgroundColor: "#f2f0e8" }}
            onClick={() => handleExample(item)}
          >
            <h1 className="text-center font-serif"> {item} </h1>
          </div>
        ))}
    </div>
  );
};

export default TailwindGen;
