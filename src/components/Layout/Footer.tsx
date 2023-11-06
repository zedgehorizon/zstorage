import React from "react";
import {Heart} from "lucide-react";
import {useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks";

export const Footer: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <footer className="h-16 flex flex-row sticky bottom-0 justify-around items-center text-lg shadow-teal-400 rounded-t-lg bg-[#1e1e1e]/30 xl:bg-transparent backdrop-blur-lg w-full">
      <a className="flex items-center font-semibold">
        Made with <Heart className="mx-1" /> by Itheum
      </a>
    </footer>
  );
};
