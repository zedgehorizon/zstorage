import React from "react";
import vault from "../../assets/img/illustration-vault.png";
import hands from "../../assets/img/hands.png";
import folders from "../../assets/img/folder-storage.png";
import { Link } from "react-router-dom";
import KeyFeatues from "../../components/LandingPage/KeyFeatures";
import { Footer } from "../../components/Layout/Footer";
import Pricing from "../../components/LandingPage/Pricing";

const LandingPage: React.FC = () => {
  return (
    <div className="top-0 w-full  h-full bg-background flex flex-grow flex-col items-center justify-start  ">
      <div className="min-w-[60%] min-h-[25rem] bg-z-image bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center">
        <div className="h-[60%]  flex flex-col justify-center items-center">
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
      <div className="p-32 w-full flex items-center justify-center">
        <div className="w-[60%] max-w-[40rem] px-8 flex flex-col allign-left gap-3">
          <span className="text-foreground/75">ZSTORAGE SOLUTION </span>
          <span className="text-2xl">Empowering users with true ownership of their data through storage</span>
          <span className="text-sm text-foreground/75">
            Itheum protocol is providing a seamless and secure way to self host data and for generating a Data Stream that can be used in Data NFT minting.{" "}
          </span>
          <Link to={"/"} className="w-[50%] max-w-[10rem] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
            Get Started
          </Link>
        </div>
        <div>
          <img src={hands}></img>{" "}
        </div>
      </div>
      <KeyFeatues />
      <div className="w-full h-full bg-white flex flex-col items-center pb-16">
        <div className="flex  ">
          <div className="w-screen h-[20%] relative">
            <div
              className="absolute h-[20%]  border-l-[100rem] border-b-[20rem] left-0 top-0
          border-solid border-t-transparent border-b-transparent border-l-background"
            />{" "}
          </div>{" "}
        </div>
        <div className="flex  ">
          <div className="w-screen h-[20%] relative">
            <div
              className="h-[20%]  border-r-[100rem] border-b-[20rem]  top-0
          border-solid border-t-transparent border-b-transparent border-r-background"
            />
          </div>
        </div>
        <div className="flex flex-col mx-auto gap-8 ">
          <img className="scale-75  " src={folders}></img>
          <span className="text-muted text-5xl  w-[60%] mx-auto text-center">
            Automative Toolkit
            <br /> for your Data Storage
          </span>
          <span className="text-base text-muted w-[50%] mx-auto text-center">
            Itheum protocol is providing a seamless and secure way to self host data and for generating a Data Stream that can be.
          </span>{" "}
        </div>
      </div>
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;
