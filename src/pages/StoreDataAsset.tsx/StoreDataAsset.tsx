import React, { useState } from "react";

import zImageHalf from "../../assets/img/z-image-half.png";
import storageIcon from "../../assets/logo/ic_baseline-updatestore.png";
import updateIcon from "../../assets/logo/ic_baseline-updateupdate.png";

import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StoreDataAssetProgress from "./components/StoreDataAssetProgress";

interface IStoreDataAssetProps {}

const StoreDataAsset: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 bg-background z-[-2]">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-screen"></img>
      <span className="text-5xl text-accent text-center text-bold">Store data asset</span>
      <StoreDataAssetProgress currentStep={currentStep} />
    </div>
  );
};

export default StoreDataAsset;
