import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="h-16 flex flex-row  bottom-0 justify-around items-center text-lg shadow-teal-400 rounded-t-lg bg-[#1e1e1e]/30 xl:bg-transparent backdrop-blur-lg w-full">
      <span className="flex items-center">
        Made with <Heart className="mx-1" /> by Zedge Horizon
      </span>
    </footer>
  );
};
