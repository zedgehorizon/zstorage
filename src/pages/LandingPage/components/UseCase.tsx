import React from "react";
import storageIllustration from "../../../assets/img/illustration-storage.png";
import realWorldIllustration from "../../../assets/img/illustration-real-world.png";

const UseCase: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <span className="text-foreground text-4xl mb-8">Use Cases</span>
      <div className=" flex flex-row gap-4">
        <div className=" w-[28rem] h-[32rem] flex flex-col">
          <div className="h-[80%] flex rounded-t-3xl bg-muted items-center justify-center">
            <img className=" " src={storageIllustration} alt="Storage Illustration" />
          </div>
          <div className="bg-foreground flex items-center justify-center rounded-b-3xl">
            <span className="  font-semibold text-center p-8 text-xl text-accent-foreground">Robust Dynamic Image, Metadata and Data Storage for NFTs</span>
          </div>
        </div>
        <div className=" w-[28rem] h-[32rem] flex flex-col">
          <div className="h-[80%] flex rounded-t-3xl h-full bg-muted items-center justify-center">
            <img className="" src={realWorldIllustration} alt="Real World Illustration" />
          </div>
          <div className="bg-foreground flex items-center justify-center rounded-b-3xl">
            <span className="font-semibold text-center p-8 text-xl text-accent-foreground">Digital Data Bunkers for Critical File Redundancy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCase;
