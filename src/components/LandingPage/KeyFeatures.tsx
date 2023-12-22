import React from "react";
import FeatureCard from "../CardComponents/FeatureCard";
import storeFile from "../../assets/img/store-file-key-features.png";
import moveFile from "../../assets/img/move-file-key-features.png";

import portabilityLogo from "../../assets/logo/portability.png";
import integrateLogo from "../../assets/logo/integrate.png";

import decentralizedLogo from "../../assets/logo/decentralized.png";
import abstractionLogo from "../../assets/logo/abstraction.png";
const KeyFeatues: React.FC = () => {
  return (
    <div className="gap-4 w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl text-foreground font-bold py-8">Key Features</h1>
      <div className="w-[80%] flex gap-4">
        <FeatureCard
          className="w-[30%]"
          title="Storage Abstraction"
          description="Seamlessly store data on centralised and decentralized platforms."
          image={storeFile}
          logo={abstractionLogo}
        />
        <FeatureCard
          className="w-[60%]"
          title="Integrate with Itheum Data NFTs"
          description="Easy linking with Itheum Data NFT licence technology."
          logo={integrateLogo}
        />
      </div>
      <div className="w-[80%] flex gap-4">
        <FeatureCard
          className="w-[60%]"
          title="Mutable decentralized Storage"
          description={`Store decentralized data that can "evolve" (non -static / mutable) data and seamless upgrade your data at any time.`}
          logo={decentralizedLogo}
        />
        <FeatureCard
          className="w-[30%]"
          title="Storage Portability"
          description="Store data once and move it between IPFS, Arweave or centralised storage like AWS."
          image={moveFile}
          logo={portabilityLogo}
        />
      </div>
    </div>
  );
};

export default KeyFeatues;
