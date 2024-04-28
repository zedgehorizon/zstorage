import React, { useState } from "react";
import { Heart } from "lucide-react";
import logoBlack from "@assets/logo/logo-black.png";
import { ELROND_NETWORK } from "@utils/constants";
import { toast } from "sonner";

const appVersion = import.meta.env.VITE_APP_VERSION ? `v${import.meta.env.VITE_APP_VERSION}` : "version number unknown";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = () => {
    if (!email) {
      toast("Please enter your email address. We need your email address to subscribe you to our newsletter.");
      return;
    }
  };
  return (
    <footer className="flex flex-col bg-accent p-2 lg:px-12 pt-4 justify-around items-center w-full">
      <div className="flex flex-col border-b-2 border-background w-[80%] text-background hidden">
        <div className="flex flex-row">
          <div className="w-[50%] flex flex-col gap-4 pb-8">
            <img src={logoBlack} className="max-w-[8rem]" />
            <span>Join our newsletter to stay up to date on features and releases.</span>
            <div className="flex flex-row gap-4">
              <input
                onChange={handleEmailChange}
                className="w-[50%] bg-background/10 border border-background rounded-full px-12 p-2"
                placeholder="Enter your email"></input>
              <button onClick={handleSubscribe} className="w-[30%] text-center focus:bg-background/20 border border-background rounded-full p-2">
                Subscribe
              </button>
            </div>
            <div className="w-[80%]">
              By subscribing you agree to with our <span className="underline">Privacy Policy</span> and provide consent to receive updates from our company.
            </div>
          </div>
          <div className="w-[50%] flex flex-row justify-end gap-16 pb-8">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-bold mb-4">Company</span>
              <span>About</span>
              <span>Blog</span>
              <span>Press</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xl font-bold mb-4">Column Two</span>
              <span>Link Six</span>
              <span>Link Seven</span>
              <span>Link Eight</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <span> Privacy policy</span>
          <span> Terms of Service</span>
          <span> Cookies Settings</span>
        </div>
      </div>
      <div className="text-sm flex items-center justify-center pb-4 text-background">
        Made with <Heart className="mx-1" color="black" /> by Zedge Horizon |&nbsp;(
        <span className="text-sm">
          {ELROND_NETWORK} {appVersion})
        </span>
      </div>
      <div className="text-sm flex items-center justify-center pb-4 text-background">
        <a href="https://www.zedgehorizon.com/post/terms-conditions-zedge-storage" target="_blank" className="hover:underline">
          Terms of use
        </a>
      </div>
    </footer>
  );
};
