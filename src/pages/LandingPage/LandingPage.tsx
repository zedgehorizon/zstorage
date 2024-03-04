import React, { useEffect } from "react";
import hands from "@assets/img/hands.png";
import folders from "@assets/img/folder-storage.png";
import frontOfTheVault from "@assets/img//cubeAnimation/front_cube.png";
import vaultBunker from "@assets/img/cubeAnimation/vault.png";
import dataLines from "@assets/img/cubeAnimation/data_lines.png";
import backOfTheVault from "@assets/img/cubeAnimation/back_cube.png";
import sideCubes from "@assets/img/cubeAnimation/side_cubes.png";
import { Link } from "react-router-dom";
import KeyFeatures from "./components/KeyFeatures";
import { Footer } from "@components/Layout/Footer";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import UseCase from "./components/UseCase";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import { MonitorCheck } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();
  useEffect(() => {
    if (window.innerWidth <= 800) {
      toast("Opt for desktop for a superior app experience! ", {
        icon: <MonitorCheck onClick={() => toast.dismiss()} className="text-accent" />,
        duration: 3000,
      });
    }
  }, []);
  return (
    <div className="top-0 w-full  h-full bg-background flex flex-grow flex-col items-center justify-start  ">
      <div className="min-w-[60%] min-h-[25rem] bg-z-image bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center">
        <div className="h-[60%]  flex flex-col justify-center items-center">
          <span className="text-[2.5rem] 2xl:text-[3.5rem] text-accent uppercase text-center">Digital Storage Bunkers</span>
          <span className="text-[2rem] 2xl:text-[3rem] ">For your most vital data</span>
          <div className="mt-3">
            {(isLoggedIn && (
              <Link
                to={"/data-bunker"}
                className="scale-75 xl:scale-100 font-bold text-accent-foreground bg-accent rounded-full px-4 lg:px-20 py-5 text-xl flex justify-center">
                Access Your Data Bunker
              </Link>
            )) || (
              <Link
                to={"/unlock"}
                className="scale-75 xl:scale-100 font-bold text-accent-foreground bg-accent rounded-full  px-4 lg:px-20 py-5 text-xl flex justify-center">
                <p className="">Get Started</p>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className=" scale-75 xl:scale-150 flex justify-center items-center h-[30rem] w-full xl:w-[50%]  ">
        <motion.div className="flex min-w-[20rem]  xl:h-[20rem] overflow-hidden">
          <motion.img
            src={frontOfTheVault}
            initial={{ x: -150, y: 160, opacity: 0 }}
            animate={{ opacity: 1, x: -40, y: 130 }}
            transition={{ duration: 3 }}
            className="absolute z-[11]"
          />
          <img src={vaultBunker} className="z-10 w-[25rem] h-[20rem]" />

          <motion.img
            src={dataLines}
            initial={{ x: -25, y: 25, opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 5 }}
            className="absolute ml-8 xl:ml-0 -z-10 xl:w-[30rem] h-[20rem]"
          />

          <motion.img src={sideCubes} initial={{ x: 100, y: -100 }} animate={{ opacity: 1, x: 100, y: 0 }} transition={{ duration: 3 }} className="absolute" />

          <motion.img
            src={backOfTheVault}
            initial={{ x: 350, y: -100 }}
            animate={{ opacity: 1, x: 275, y: 0 }}
            transition={{ duration: 3 }}
            className="absolute -ml-16 xl:-ml-0"
          />

          <motion.div initial={{ x: 280, y: 250 }} animate={{ opacity: 1, x: 220, y: 180 }} transition={{ duration: 3 }} className="z-[11] absolute">
            <img src={sideCubes} className="" />
            <img src={sideCubes} className="-mt-[35px]" />
          </motion.div>
        </motion.div>
      </div>

      <div id="solution" className="pt-16 lg:p-32 w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full xl:w-[60%] max-w-[40rem]  px-8 flex flex-col align-left gap-3">
          <span className="text-foreground/75">The zEdgeStorage Solution</span>
          <span className="text-2xl">Your 'Plan Z' for Data Storage</span>
          <span className="text-sm text-foreground/75">
            You may have a plan A, B, C... to protect our most vital data, but the attack and censorship vectors for all these plans are the same.
          </span>
          <span className="text-sm text-foreground/75">
            Safeguarding your vital data requires a "new strategy." zEdgeStorage offers a "Plan Z" solution that works alongside your existing storage plans. A
            seamless interface allows you to access distributed storage while ensuring sovereign encryption, creating digital data bunkers as your last line of
            defense.
          </span>
          <div>
            {(isLoggedIn && (
              <Link to={"/start"} className=" max-w-[15rem] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
                Manage Data Assets
              </Link>
            )) || (
              <Link
                to={"/unlock"}
                className="w-[50%] max-w-[10rem] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
                <p className="">Get Started</p>{" "}
              </Link>
            )}
          </div>
        </div>
        <div>
          <img src={hands}></img>
        </div>
      </div>
      <UseCase />
      <div id="features"></div>
      <KeyFeatures />
      <div className="w-full h-full bg-background flex flex-col items-center pb-16">
        <div className="  mt-8 flex flex-col justify-center items-center w-full h-[100svh] bg-top bg-white-rectangle bg-cover bg-no-repeat">
          <img className="scale-75 lg:scale-100" src={folders}></img>
          <span className=" text-muted text-2xl lg:text-5xl w-[60%] mx-auto text-center">
            Complete Toolkit
            <br /> for your Digital Data Bunker
          </span>
          <span className="text-base text-muted w-[50%] mx-auto text-center">
            Providing you with all the tools your need to upload, update, manage and control your most vital data assets.
          </span>{" "}
        </div>
      </div>
      <div id="pricing"></div>
      <Pricing />
      <div id="testimonials"></div>
      {/*<Testimonials testimonials={testimonialsData} />*/}
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPage;
