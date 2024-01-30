import React from "react";
import arrowRight from "../../../assets/img/arrow1.png";
import arrowDownRight from "../../../assets/img/arrow2.png";
import { cn } from "../../../utils/utils";

interface IStoreDataAssetProgressProps {
  currentStep: number;
}

const StoreDataAssetProgress: React.FC<IStoreDataAssetProgressProps> = (props) => {
  const { currentStep } = props;
  return (
    <div className="w-full h-[20%] flex flex-row items-center justify-center ">
      <div className="flex flex-col justify-center items-center gap-4">
        <span
          className={cn(
            "bg-muted text-2xl font bold p-4 px-7 max-w-[5rem] rounded-3xl border border-accent text-center",
            currentStep === 1 ? "animate-pulse shadow-lg shadow-accent" : ""
          )}>
          1
        </span>
        <label className="text-foreground/80  z-2"> Storage Type</label>
      </div>
      <img className="-mt-16 " src={arrowRight}></img>
      <div className="flex flex-col justify-center items-center gap-4">
        <span
          className={cn(
            "bg-muted text-2xl font bold p-4 px-7 max-w-[5rem] rounded-3xl border border-accent text-center",
            currentStep === 2 ? "animate-pulse shadow-lg shadow-accent" : ""
          )}>
          2
        </span>
        <label className="text-foreground/80 text-center"> Data Asset Type</label>
      </div>
      <img className="mt-8" src={arrowDownRight}></img>
      <div className="flex flex-col justify-center items-center gap-4">
        <span
          className={cn(
            "bg-muted text-2xl font bold p-4 px-7 max-w-[5rem] rounded-3xl border border-accent text-center",
            currentStep === 3 ? "animate-pulse shadow-lg shadow-accent" : ""
          )}>
          3
        </span>
        <label className=" text-foreground/80 text-center"> Storage Preference</label>
      </div>
      <img className="-mt-16 " src={arrowRight}></img>
      <div className=" flex flex-col justify-center items-center gap-4">
        <span
          className={cn(
            "bg-muted text-2xl font bold p-4 px-7 max-w-[5rem] rounded-3xl border border-accent text-center",
            currentStep === 4 ? "animate-pulse shadow-lg shadow-accent" : ""
          )}>
          4
        </span>
        <span className=" text-foreground/80 max-w-[8rem] text-center"> Storage Option</span>
      </div>
    </div>
  );
};

export default StoreDataAssetProgress;
