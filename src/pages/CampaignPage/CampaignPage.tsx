import React, { useEffect } from "react";
import vault from "@assets/img/illustration-vault.png";
import { Link } from "react-router-dom";
import { Footer } from "@components/Layout/Footer";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import toast from "react-hot-toast";
import { Lightbulb, MonitorCheck } from "lucide-react";

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
      <div className="min-w-[60%] min-h-[25rem] bg-z-image bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center">
        <div className="h-[60%] flex flex-col justify-center items-center">
          <span className="text-[3rem] 2xl:text-[4rem] justify-center text-center">
            <span className="text-accent">Store</span> your Itheum
            <br />
            <span className="text-accent ">Music Data NFT</span> Files
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
                <p className="">Get Started</p>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="lg:-mt-12 z-2 mb-4 ">
        <img src={vault}></img>
      </div>
      <Footer />
    </div>
  );
};

export default CampaignPage;
