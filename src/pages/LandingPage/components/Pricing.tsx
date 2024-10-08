import React from "react";
import PriceCard from "./PriceCard";

const Pricing: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center pb-24 pt-24">
      <div className="w-[60%] flex flex-col gap-4 mb-24">
        <span className="text-4xl text-center">Get started for Free</span>
        <span className="text-sm text-foreground/75 text-center">
          zEdgeStorage offers a variety of plans tailored to accommodate every phase of your digital data bunker initiatives. Commence with the Free Plan,
          adjust your subscription according to your requirements.
        </span>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <PriceCard
          plan="BASIC"
          title="Go Basic"
          price={"0"}
          features={["10MB Storage", "500MB Bandwidth"]}
          description="Upload and manage your vital data. Built-in support for Itheum Data NFTs."
        />
        <PriceCard
          plan="PREMIUM"
          title="Go Zzz"
          price={"10"}
          features={["1GB Storage", "1GB Bandwidth"]}
          description="Everything in basic with more storage and bandwidth for your vital data."
        />
        <PriceCard
          plan="ENTERPRISE"
          title="Go Big"
          price={"Custom"}
          features={["Custom plan that suits your needs"]}
          description="For your custom data bunker needs like sovereign encryption of vital data."
          buttonText="Contact Us"
        />
      </div>
    </div>
  );
};

export default Pricing;
