import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import Banner from "@/components/Banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Generate Tailwind CSS",
  description: "Generate Tailwind Components using GPT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* <Banner /> */}
        </div>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
