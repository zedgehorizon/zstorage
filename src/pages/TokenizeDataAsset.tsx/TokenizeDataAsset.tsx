import React, { useState, useEffect } from "react";
import zImageHalf from "@assets/img/z-image-half.png";
import { Link } from "react-router-dom";
import StoreDataAssetProgress from "./components/StoreDataAssetProgress";
import { XStorageCheckBox } from "./components/XStorageCheckBox";
import { Button } from "@libComponents/Button";
import { useNavigate } from "react-router-dom";
import { SUI_WALRUS_STRATEGY_STRING } from "utils/constants";

const TokenizeDataAsset = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenizationStrategy, setTokenizationStrategy] = useState("");
  const [template, setTemplate] = useState("");
  const [storagePreference, setStoragePreference] = useState();
  const [storageOption, setStorageOption] = useState();
  const navigate = useNavigate();
  const [dataStreamForWorkflow, setDataStreamForWorkflow] = useState<string | null>(null);

  useEffect(() => {
    const dataStreamForWorkflow = new URLSearchParams(window.location.search).get("dataStreamForWorkflow");
    setDataStreamForWorkflow(dataStreamForWorkflow || null);
  }, []);

  const isNextButtonDisabled = () => {
    if (currentStep === 1 && tokenizationStrategy) return false;
    // if (currentStep === 2 && template) return false;
    // if (currentStep === 3 && storagePreference) return false;
    // if (currentStep === 4 && storageOption) return false;
    return true;
  };

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    // if (currentStep === 4) navigate("/upload-music");
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[100svh] gap-4 bg-background z-[-2]">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-[100svh]"></img>

      <span className="text-5xl p-8 text-accent text-center text-bold">Tokenize Data Asset</span>
      <div className="gap-4 flex flex-col w-[80%] items-center justify-center">
        <StoreDataAssetProgress currentStep={currentStep} />

        {currentStep === 1 && (
          <XStorageCheckBox
            title="Select your tokenization strategy"
            options={["Self Serve", "Full Service"]}
            currentOption={tokenizationStrategy}
            descriptions={[
              "Only generate the data token metadata file (with optional built-in IP Licensing) which you can then use in your own scripts to mint data tokens",
              "Follow the full service wizard to mint your data tokens on selected blockchains and with optional built-in IP Licensing",
            ]}
            setterFunction={setTokenizationStrategy}
            disabled={[false, true]}
          />
        )}

        {/* {currentStep === 2 && (
          <XStorageCheckBox
            title="What type of data asset would you like to store?"
            // description="OR choose any specific Itheum Data Stream template that you would like to use"
            options={["Upload My Files", "Music Data NFT", "Trailblazer Data NFT"]}
            currentOption={template}
            descriptions={[
              "Upload and store a single file or multiple files.",
              "Set up dynamic storage for your Itheum Music Data NFT.",
              "Set up dynamic storage for your Trailblazer Data NFT.",
            ]}
            setterFunction={setTemplate}
            disabled={[false, false, false]}
          />
        )} */}

        {/* {currentStep === 3 && (
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

        {currentStep === 4 && (
          <XStorageCheckBox
            title="Do you have a preferred storage platform and architecture?"
            options={["DNS + IPFS", "IPNS + IPFS", SUI_WALRUS_STRATEGY_STRING, "Arweave"]}
            currentOption={storageOption}
            setterFunction={setStorageOption}
            disabled={[false, false, false, true]}
          />
        )} */}

        <div className="flex justify-between w-[70%] text-2xl pb-16">
          <Button
            className=" font-normal text-base p-4 px-8 rounded-full border border-accent text-foreground"
            disabled={currentStep === 1}
            onClick={handleGoBack}>
            {" "}
            Go Back
          </Button>

          {currentStep === 4 || tokenizationStrategy.includes("Self Serve") ? (
            <Link
              to={
                currentStep === 1
                  ? dataStreamForWorkflow
                    ? "/tokenize-self-serve?dataStreamForWorkflow=" + dataStreamForWorkflow
                    : "/tokenize-self-serve"
                  : template.includes("Upload My Files")
                    ? "/upload"
                    : template.includes("Trailblazer Data NFT")
                      ? "/upload-trailblazer"
                      : "/upload-music"
              }
              state={{
                type: tokenizationStrategy,
                template: template,
                storage: storagePreference,
                decentralized: storageOption,
              }}
              className="font-normal text-base text-center px-8 flex justify-center items-center rounded-full bg-accent text-accent-foreground">
              Create data token metadata files
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

export default TokenizeDataAsset;
