import React from "react";
import vault from "../../assets/img/illustration-vault.png";
import hands from "../../assets/img/hands.png";

import { Link } from "react-router-dom";
import KeyFeatues from "../../components/LandingPage/KeyFeatures";

const LandingPage: React.FC = () => {
  return (
    <div className="top-0 w-full  h-full bg-background flex flex-grow flex-col items-center justify-start  ">
      <div className="min-w-[60%] min-h-[25rem] bg-z-image bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center">
        <div className="h-[60%]  flex flex-col justify-center items-center">
          <span className="text-[3rem] 2xl:text-[4rem]">End-to-End</span>
          <span className="text-[3rem] 2xl:text-[4rem] text-accent">Storage Solution</span>
          <span className="text-[3rem] 2xl:text-[4rem] ">Built for Data Ownership</span>
          <span className="text-sm w-[65%] text-center text-foreground/50 ">
            Allows seamless storage solutions that integrate directly with the Itheum data brokerage protocol.
          </span>
        </div>
      </div>
      <div className="-mt-12 z-2  ">
        <img src={vault}></img>
      </div>
      <div className="p-32 w-full flex">
        <div className="w-[60%] px-8 flex flex-col allign-left gap-3">
          <span className="text-foreground/75">ZSTORAGE SOLUTION </span>
          <span className="text-2xl">Empowering users with true ownership of their data through storage</span>
          <span className="text-sm text-foreground/75">
            Itheum protocol is providing a seamless and secure way to self host data and for generating a Data Stream that can be used in Data NFT minting.{" "}
          </span>
          <Link to={"/"} className="max-w-[50%] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
            Get Started
          </Link>
        </div>
        <div>
          <img src={hands}></img>{" "}
        </div>
      </div>
      <KeyFeatues />
    </div>
  );
};

export default LandingPage;
