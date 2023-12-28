import React from "react";
import { Heart } from "lucide-react";
import logoBlack from "../../assets/logo/logo-black.png";
export const Footer: React.FC = () => {
  return (
    <footer className=" flex flex-col bg-accent px-12 pt-16 gap-4 justify-around items-center w-full">
      <div className="flex flex-col border-b-2 border-background w-[80%] text-background text-xl">
        <div className="flex flex-row">
          <div className="w-[50%] flex flex-col gap-4  pb-16">
            <img src={logoBlack} className="max-w-[10rem]" />
            <span>Join our newsletter to stay up to date on features and releases.</span>
            <div className="flex flex-row gap-4">
              <input className="w-[50%] bg-background/10 border-2 border-background rounded-full px-12 p-4" placeholder="Enter your email"></input>
              <button className="w-[30%] text-center border-2 border-background rounded-full p-4">Subscribe</button>
            </div>
            <div className="w-[80%]">
              By subscribing you agree to with our <span className="underline">Privacy Policy</span> and provide consent to receive updates from our company.
            </div>
          </div>
          <div className="w-[50%] flex flex-row justify-end gap-16 pb-16">
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold mb-4">Company</span>
              <span>About</span>
              <span>Blog</span>
              <span>Press</span>
              <span>Jobs</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold mb-4">Column Two</span>
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
      <span className="text-2xl flex items-center    text-background ">
        Made with <Heart className="mx-1 " color="black" /> by Zedge Horizon
      </span>
    </footer>
  );
};
