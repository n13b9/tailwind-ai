import { useEffect } from "react";

const DynamicCSS = ({ href }) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [href]);

  return null;
};

export default DynamicCSS;
