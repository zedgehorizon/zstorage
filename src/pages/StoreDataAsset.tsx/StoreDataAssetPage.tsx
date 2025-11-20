import React, { useState } from "react";
import zImageHalf from "@assets/img/z-image-half.png";
import { Link } from "react-router-dom";
import StoreDataAssetProgress from "./components/StoreDataAssetProgress";
import { XStorageCheckBox } from "./components/XStorageCheckBox";
import { Button } from "@libComponents/Button";
import { useNavigate } from "react-router-dom";
import { SUI_WALRUS_STRATEGY_STRING } from "utils/constants";

const StoreDataAsset = () => {
  const [template, setTemplate] = useState(""); // step 1
  const [storagePreference, setStoragePreference] = useState(""); // step 2
  const [storageType, setStorageType] = useState(""); // step 3
  const [storageOption, setStorageOption] = useState(""); // step 4
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const isNextButtonDisabled = () => {
    if (currentStep === 1 && template) return false; // is it upload my files or music data nft or Time Capsule Data NFT
    if (currentStep === 2 && storagePreference) return false; // is it centralized or decentralized
    if (currentStep === 3 && storageType) return false; // is it static data storage or dynamic data storage
    if (currentStep === 4 && storageOption) return false; // is it dns + ipfs or ipns + ipfs or sui walrus or arweave
    return true;
  };

  const handleGoBack = () => {
    // when we go back, we need to reset any selected value the user was on before going back based on the current step
    if (currentStep === 2) {
      setStoragePreference("");
    }
    if (currentStep === 3) {
      setStorageType("");
    }
    if (currentStep === 4) {
      setStorageOption("");
    }

    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  function getAvailableDataAssetTypeOptionsForPreselection() {
    // if user has selected "Static Data storage" then only "Static Data storage" should be available
    // ... "Static Data storage" should be disabled for any value other than "Static Data storage"
    if (template === "Upload My Files") {
      return [false, false];
    } else if (template === "Music Data NFT") {
      return [false, false];
    } else if (template === "Time Capsule Data NFT") {
      return [true, false];
    }
  }

  function getAvailableStorageOptionsForPreselection() {
    // if user has selected "Static Data storage" then only "IPFS Only" should be available
    // ... "IPFS Only" should be disabled for any value other than "Static Data storage"

    if (storageType === "Static Data storage") {
      if (template === "Music Data NFT") {
        return [true, true, true, false, true];
      } else {
        return [false, true, true, false, true];
      }
    }

    return [true, false, false, true, true];
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-[100svh] gap-4 bg-background z-[-2] mt-10">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-[100svh]"></img>

      <span className="text-5xl p-8 text-accent text-center text-bold">Store Data Asset</span>
      <div className="gap-4 flex flex-col w-[80%] items-center justify-center">
        <StoreDataAssetProgress currentStep={currentStep} />

        <div className="text-accent mt-5 p-4 rounded-lg bg-accent/10">
          Current Storage Strategy:{" "}
          <span className="text-white">
            {template === "" && storagePreference === "" && storageType === "" && storageOption === "" && "Select below..."}
            {template !== "" ? template : ""}
            {storagePreference !== "" ? `> ${storagePreference}` : ""}
            {storageType !== "" ? ` > ${storageType}` : ""}
            {storageOption !== "" ? ` > ${storageOption}` : ""}
          </span>
        </div>

        {currentStep === 1 && (
          <XStorageCheckBox
            title="What type of data asset would you like to store?"
            options={["Upload My Files", "Music Data NFT", "Time Capsule Data NFT"]}
            currentOption={template}
            descriptions={[
              "Upload and store a single file or multiple files.",
              "Set up storage for your Music Data NFT that compatible on apps built on Itheum compatible apps (e.g. Sigma Music).",
              "Set up storage for a Time Capsule Data NFT, which is a digital time capsule that can be opened in the future.",
            ]}
            setterFunction={setTemplate}
            disabled={[false, false, false]}
          />
        )}

        {currentStep === 2 && (
          <XStorageCheckBox
            title="How would you like your data asset to be stored?"
            options={["Centralized / Web2 Storage", "Decentralized / Web3 Storage"]}
            currentOption={storagePreference}
            descriptions={[
              "A regular cloud storage model. You can start here and move to Web3 storage later.",
              "A model of data storage where data assets are distributed across a network of nodes without a central point of control.",
            ]}
            setterFunction={setStoragePreference}
            disabled={[true, false]}
          />
        )}

        {currentStep === 3 && (
          <XStorageCheckBox
            title="Select your Data Asset Type"
            options={["Static Data storage", "Dynamic Data storage"]}
            currentOption={storageType}
            descriptions={[
              "This is a type of storage for your static data assets (i.e non-changing or infrequently updated data) that remains constant over time.",
              "This is a type of storage for your dynamic data assets typically that is constantly changing or updating and evolve over time.",
            ]}
            setterFunction={setStorageType}
            disabled={getAvailableDataAssetTypeOptionsForPreselection()}
            disabledLabel="Unavailable"
          />
        )}

        {currentStep === 4 && (
          <XStorageCheckBox
            title="Do you have a preferred storage platform and architecture?"
            options={["IPFS Only", "DNS + IPFS", "IPNS + IPFS", SUI_WALRUS_STRATEGY_STRING, "Arweave"]}
            currentOption={storageOption}
            setterFunction={setStorageOption}
            disabled={getAvailableStorageOptionsForPreselection()}
            disabledLabel="Unavailable"
          />
        )}

        <div className="flex justify-between w-[70%] text-2xl pb-16">
          <Button
            className=" font-normal text-base p-4 px-8 rounded-full border border-accent text-foreground"
            disabled={currentStep === 1}
            onClick={handleGoBack}>
            {" "}
            Go Back
          </Button>

          {currentStep === 4 ? (
            <Link
              to={
                storageOption === "IPFS Only" ||
                (storageOption === SUI_WALRUS_STRATEGY_STRING && storageType === "Static Data storage" && template === "Upload My Files")
                  ? `/upload-static?storageOption=${storageOption === SUI_WALRUS_STRATEGY_STRING ? "walrus" : "ipfs"}`
                  : template.includes("Upload My Files")
                    ? "/upload"
                    : template.includes("Time Capsule Data NFT")
                      ? `/upload-trailblazer?storageOption=${storageOption === SUI_WALRUS_STRATEGY_STRING ? "walrus" : "ipfs"}`
                      : `/upload-music?storageOption=${storageOption === SUI_WALRUS_STRATEGY_STRING ? "walrus" : "ipfs"}`
              }
              state={{
                type: storageType,
                template: template,
                storage: storagePreference,
                decentralized: storageOption,
              }}
              className="font-normal text-base text-center px-8 flex justify-center items-center rounded-full bg-accent text-accent-foreground">
              Start uploading
            </Link>
          ) : (
            <Button
              disabled={isNextButtonDisabled()}
              className="font-normal text-base p-4 px-8 rounded-full bg-accent text-accent-foreground"
              onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDataAsset;
