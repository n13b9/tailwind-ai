import React from "react";

const Banner = () => {
  return (
    <div className=" bg-myorange text-center">
      <h1 className="text-white p-1">
        Made by Neeraj Barla. Actively looking for fullstack roles.
        <a
          href="resume-link"
          target="_blank"
          className="text-white mx-1 underline hover:text-gray-300"
        >
          Resume
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          className="text-white mx-1 underline hover:text-gray-300"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/n13b9"
          target="_blank"
          className="text-white mx-1 underline hover:text-gray-300"
        >
          Github
        </a>
        <a
          href="https://wa.me/7738513969"
          target="_blank"
          className="text-white mx-1 underline hover:text-gray-300"
        >
          WhatsApp
        </a>
      </h1>
    </div>
  );
};

export default Banner;
