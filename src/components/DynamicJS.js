import { useEffect } from "react";

const DynamicJS = ({ href }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = href;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [href]);

  return null;
};

export default DynamicJS;
