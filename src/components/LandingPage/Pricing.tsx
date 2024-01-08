import React from "react";
import PriceCard from "../CardComponents/PriceCard";

const Pricing: React.FC = () => {
  return (
    <div className="flex justify-between pb-24 pt-24">
      <div className="w-[60%] p-8 pt-0 max-w-[30rem] px-8 flex flex-col allign-left gap-3">
        <span className="text-foreground/75">ZSTORAGE PRICING</span>
        <div className="flex flex-col gap-2">
          <span className="text-4xl max-w-[20rem]">Get started for Free</span>
          <span className="text-sm text-foreground/75 max-w-[20rem]">
            zStorage offers a variety of developer plans tailored to accommodate every phase of your data assets storage journey. Commence with the Free Plan,
            adjust your subscription according to your requirements.
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <PriceCard
          plan="BASIC"
          title="Go Basic"
          price={0}
          features={["1GB Storage", "10GB Bandwidth"]}
          description="Store data once and move it between IPFS, Arweave or "
        />
        <PriceCard
          plan="PREMIUM"
          title="Go Zzz"
          price={10}
          features={["500GB Storage", "500GB Bandwidth"]}
          description="Store data once and move it between IPFS, Arweave or "
        />
      </div>
    </div>
  );
};

export default Pricing;
