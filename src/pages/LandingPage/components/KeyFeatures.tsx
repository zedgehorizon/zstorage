import React from "react";
import FeatureCard from "./FeatureCard";
import storeFile from "@assets/img/store-file-key-features-supports.png";
import moveFile from "@assets/img/move-file-key-features.png";
import portabilityLogo from "@assets/logo/portability.png";
import integrateLogo from "@assets/logo/integrate.png";
import decentralizedLogo from "@assets/logo/decentralized.png";
import abstractionLogo from "@assets/logo/abstraction.png";

const KeyFeatures: React.FC = () => {
  return (
    <div className="gap-4 w-full h-full flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl text-foreground font-bold py-8">Key Features</h1>
      <div className="w-[80%] max-w-[80rem] flex flex-col lg:flex-row  gap-4 justify-center items-center lg:items-stretch">
        <FeatureCard
          className="w-full lg:w-[40%] max-w-[20rem]"
          title="Built for Itheum Data NFTs"
          description="Easy linking of your stored data with Itheum's Data NFT web3 license technology to provide blockchain powered 'access-control'."
          subDesc="For e.g. Store multiple music tracks as a Music EP and mint it as a single Music NFT collection with a few clicks"
          cta="https://docs.itheum.io/product-docs/product/data-dex/minting-a-data-nft/store-data-and-mint-a-data-nft-step-by-step-tutorial~Watch Demo"
          logo={integrateLogo}
        />
        <FeatureCard
          className="w-full max-w-[20rem] lg:max-w-none lg:w-[60%]"
          title="Storage Abstraction"
          description="Seamlessly store and update data on centralized and decentralized platforms for robust distribution of your data assets."
          subDesc="Currently supports IPFS, IPNS and Sui Walrus (Beta)"
          image={storeFile}
          logo={abstractionLogo}
        />
      </div>
      <div className="w-[80%] max-w-[80rem] flex flex-col lg:flex-row gap-4 justify-center items-center lg:items-stretch">
        <FeatureCard
          className="w-full max-w-[20rem] lg:max-w-none lg:w-[60%]"
          title="Mutable Decentralized Storage"
          description={`Store decentralized data that can "evolve" (non-static / mutable) and be updated with built in 'deduplication' to only store updated segments of your data and minimize cost and increase speed of recovery.`}
          logo={decentralizedLogo}
        />
        <FeatureCard
          className="w-full lg:w-[30%] max-w-[20rem]"
          title="Storage Portability"
          description="Store data once and move it between IPFS, Arweave or centralized storage like AWS for data asset protection."
          image={moveFile}
          logo={portabilityLogo}
        />
      </div>
    </div>
  );
};

export default KeyFeatures;
