import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@components/Layout/Footer";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import toast from "react-hot-toast";
import { MonitorCheck } from "lucide-react";
import frontOfTheVault from "@assets/img//cubeAnimation/front_cube.png";
import vaultBunker from "@assets/img/cubeAnimation/vault.png";
import dataLines from "@assets/img/cubeAnimation/data_lines.png";
import backOfTheVault from "@assets/img/cubeAnimation/back_cube.png";
import sideCubes from "@assets/img/cubeAnimation/side_cubes.png";
import { motion } from "framer-motion";
import zImage from "@assets/img/z-image.png";

const CampaignPage: React.FC = () => {
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
      <div className="py-16 relative flex items-center justify-center">
        <img src={zImage} className="absolute top-0  max-h-[25rem] object-cover mx-auto" alt="Background" />
        <div className="z-10 flex flex-col justify-center items-center h-full w-full">
          <span className="text-[3rem] 2xl:text-[4rem] text-center">
            <span className="text-accent">Store</span> your Itheum
            <br />
            <span className="text-accent">Music Data NFT</span> Files
          </span>
          <div className="mt-3">
            {(isLoggedIn && (
              <Link
                to={"/data-bunker?r=itheum-music-data-nft"}
                className="font-bold text-accent-foreground bg-accent rounded-full px-20 py-5 flex justify-center">
                Access Your Data Bunker
              </Link>
            )) || (
              <Link
                to={"/unlock?r=itheum-music-data-nft"}
                className="font-bold text-accent-foreground bg-accent rounded-full px-20 py-5 flex justify-center text-xl">
                <p>Get Started</p>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="-z-1 scale-75 xl:scale-150 flex justify-center items-center h-[30rem] w-full xl:w-[50%] xl:mb-16 ">
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
      <Footer />
    </div>
  );
};

export default CampaignPage;
