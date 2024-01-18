import React, { useState } from "react";

import zImageHalf from "../../assets/img/z-image-half.png";
import storageIcon from "../../assets/logo/ic_baseline-updatestore.png";
import updateIcon from "../../assets/logo/ic_baseline-updateupdate.png";

import { Heart, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StoreDataAssetProgress from "./components/StoreDataAssetProgress";
import { XStorageCheckBox } from "../../components/InputComponents/XStorageCheckBox";
import { Button } from "../../libComponents/Button";
import { Footer } from "../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

interface IStoreDataAssetProps {}

const StoreDataAsset: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataAssetAction, setDataAssetAction] = useState("");
  const [storageType, setStorageType] = useState();
  const [dynamicDataStream, setDynamicDataStream] = useState();
  const [storagePreference, setStoragePreference] = useState();
  const [storageOption, setStorageOption] = useState();
  const navigate = useNavigate();

  const isNextButtonDissabled = () => {
    if (currentStep === 1 && storageType) return false;
    if (currentStep === 2 && dynamicDataStream) return false;
    if (currentStep === 3 && storagePreference) return false;
    if (currentStep === 4 && storageOption) return false;
    return true;
  };

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep === 4) navigate("/upload");
    setCurrentStep(currentStep + 1);
  };
  console.log(currentStep, " ___ > ", storageType, " ___ > ", dynamicDataStream, " ___ > ", storagePreference, " ___ > ", storageOption);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 bg-background z-[-2]">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-screen"></img>

      <span className="text-5xl p-8 text-accent text-center text-bold">Store data asset</span>
      <div className="gap-4 flex flex-col w-[80%] items-center jusitfy-center">
        <StoreDataAssetProgress currentStep={currentStep} />
        {currentStep === 1 && (
          <XStorageCheckBox
            title="Select the type of storage for your data asset."
            options={["Static Data storage", "Dynamic Data storage"]}
            currentOption={storageType}
            descriptions={[
              "This is a type of storage for your static data assets (i.e non-changing or infrequently updated data) that remains constant over time.",
              "This is a type of storage for your dynamic data assets typically that is constantly changing or updating and evolve over time.",
            ]}
            setterFunction={setStorageType}
            disabled={[true, false]}
          />
        )}
        {currentStep === 2 && (
          <XStorageCheckBox
            title="Data Asset type"
            description="OR choose any specific Itheum Data Stream template that you would like to use"
            options={["Create my own", "Music data NFT", "Trailblazer data NFT"]}
            currentOption={dynamicDataStream}
            descriptions={[
              "This is a type of storage for your static data assets (i.e non-changing or infrequently",
              "Set up a dynamic storage for your music data NFT.",
              "Set up a dynamic storage for your trailblazer data NFT.",
            ]}
            setterFunction={setDynamicDataStream}
            disabled={[true, false, true]}
          />
        )}
        {currentStep === 3 && (
          <XStorageCheckBox
            title="How would you like your data to be stored?"
            options={["Centralized/Web2 storage", "Decentralized/Web3 storage"]}
            currentOption={storagePreference}
            descriptions={[
              "This model of data storage are concentrated in a central location or controlled by a central authority.",
              "TThis model of data storage may be distributed across a network of nodes without a central point of control.",
            ]}
            setterFunction={setStoragePreference}
            disabled={[true, false]}
          />
        )}
        {currentStep === 4 && (
          <XStorageCheckBox
            title="Storage Options"
            options={["DNS (domain) + IPFS", "DNS (domain) + Arweave", "Ceramic", "IPNS + IPFS"]}
            currentOption={storageOption}
            setterFunction={setStorageOption}
            disabled={[false, true, true, true]}
          />
        )}

        <div className="flex justify-between w-[70%] text-2xl">
          <Button
            className=" font-normal text-base p-4 px-8 rounded-full border border-accent text-foreground"
            disabled={currentStep === 1}
            onClick={handleGoBack}>
            {" "}
            Go Back
          </Button>

          {currentStep === 4 ? (
            <Link
              to={"/upload"}
              state={{
                action: dataAssetAction,
                type: storageType,
                template: dynamicDataStream,
                storage: storagePreference,
                decentralized: storageOption,
              }}
              className="font-normal text-base p-4 px-8 rounded-full bg-accent text-accent-foreground">
              Start uploading
            </Link>
          ) : (
            <Button
              disabled={isNextButtonDissabled()}
              className="font-normal text-base p-4 px-8 rounded-full bg-accent text-accent-foreground"
              onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
        <span className="text-xl flex items-center pb-4 text-foreground ">
          Made with <Heart className="mx-1 " color="white" /> by Zedge Horizon
        </span>
      </div>
    </div>
  );
};

export default StoreDataAsset;
