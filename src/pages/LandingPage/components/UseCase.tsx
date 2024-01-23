import React from "react";
import storageIlustration from "../../../assets/img/illustration-storage.png";
import realWorldIlustration from "../../../assets/img/ilustration-real-world.png";

const UseCase: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <span className="text-foreground text-4xl mb-8">Use Case </span>
      <div className=" flex flex-row gap-4">
        <div className=" w-[28rem] h-[32rem] flex flex-col">
          <div className="h-[80%] flex rounded-t-3xl bg-muted items-center justify-center">
            <img className=" " src={storageIlustration} alt="Storage Ilustration" />
          </div>
          <div className="bg-foreground flex items-center justify-center rounded-b-3xl">
            <span className="  font-semibold text-center p-8 text-xl text-accent-foreground">Robust NFT Dynamic and Static Image and Metadata Storage </span>
          </div>
        </div>
        <div className=" w-[28rem] h-[32rem] flex flex-col">
          <div className="h-[80%] flex rounded-t-3xl h-full bg-muted items-center justify-center">
            <img className="" src={realWorldIlustration} alt="Real World Ilustration" />
          </div>
          <div className="bg-foreground flex items-center justify-center rounded-b-3xl">
            <span className="font-semibold text-center p-8 text-xl text-accent-foreground">Real-World Data Vaults for Critical File Redundancy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCase;
