import React, { useEffect } from "react";
import { Modal } from "@components/Modal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "@components/ErrorComponents/ErrorFallbackMusicDataNfts";
import { Progress } from "@libComponents/Progress";
import { Link } from "react-router-dom";
import CidsView from "./CidsView";
import NextStepsModal from "@components/Modals/NextStepsModal";
import { generateRandomString, publishIpns, uploadFilesRequest } from "@utils/functions";
import { CATEGORIES } from "@utils/constants";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { toast } from "sonner";
import { useHeaderStore } from "store/header";
import { SUI_WALRUS_STRATEGY_STRING } from "../../../utils/constants";

interface DataObjectsListProps {
  DataObjectsComponents: React.ReactNode[];
  category: number;
  addButton?: React.ReactNode;
  transformFilesToDataArray: () => Promise<any>;
  setResponsesOnSuccess: (response: { hash: string; folderHash: string; fileName: string; ipnsResponseHash?: string }) => void;
  validateDataObjects: () => boolean;
  manifestCid?: string;
  folderHash?: string;
  recentlyUploadedManifestFileName?: string;
  errorMessage?: string;
  ipnsHash?: string; // make one object with ipnsKey and ipnsHash
  ipnsKey?: string;
  storageType?: string;
  manifestFile?: any;
}

const DataObjectsList: React.FC<DataObjectsListProps> = (props) => {
  const {
    addButton,
    category,
    DataObjectsComponents,
    manifestCid,
    recentlyUploadedManifestFileName,
    folderHash,
    transformFilesToDataArray,
    setResponsesOnSuccess,
    validateDataObjects,
    errorMessage,
    ipnsHash,
    ipnsKey,
    storageType,
    manifestFile,
  } = props;

  const { name, creator, createdOn, stream } = useHeaderStore((state: any) => ({
    name: state.name,
    creator: state.creator,
    createdOn: state.createdOn,
    stream: state.stream,
  }));

  const { tokenLogin } = useGetLoginInfo();
  const [progressValue, setProgressValue] = React.useState(0);
  const [errors, setErrors] = React.useState<string>();
  const tweetText = "url=https://explorer.itheum.io&text=I just updated the data stream for my Data NFT! Interact with it here:";

  // useEffect hook to load the progress bar smoothly to 100 in 10 seconds
  useEffect(() => {
    if (progressValue > 0 && progressValue < 99 && !errorMessage) {
      const interval = 100; // Time interval in milliseconds
      const totalTime = 10000; // Total time for the progress to reach 100 (in milliseconds) - 10 seconds
      const steps = 100 / (totalTime / interval);

      const updateProgress = () => {
        setProgressValue((prevProgress) => {
          const newProgress = prevProgress + steps;
          return newProgress <= 99 ? newProgress : 99;
        });
      };

      const progressInterval = setInterval(updateProgress, interval);

      return () => clearInterval(progressInterval);
    }
  }, [progressValue]);

  /**
   * Generates a manifest file based on the form data and uploads it to the server.
   * If any required fields are missing, an error toast is displayed.

   * The manifest file is uploaded to the server using a multipart/form-data request.
   * The response contains the CID (Content Identifier) of the uploaded manifest file.
   * If the upload is successful, the CID is set as the manifestCid state.
   * @throws {Error} If there is an error transforming the data or if the manifest file is not uploaded correctly.
   */
  const generateManifestFile = async () => {
    setProgressValue(12);

    try {
      const data = await transformFilesToDataArray();

      if (data === undefined) {
        return;
      }

      // storageType will be used for NEW manifest and manifestFile?.data_stream?.storageStrategy for edits
      const storageStrategy = storageType || manifestFile?.data_stream?.storageStrategy || "";

      const manifest = {
        "data_stream": {
          "category": CATEGORIES[category],
          "name": name,
          "creator": creator,
          "created_on": createdOn,
          "last_modified_on": new Date().toISOString().split("T")[0],
          "storageStrategy": storageStrategy,
          "marshalManifest": {
            "totalItems": data.length,
            "nestedStream": stream,
          },
        },
        "data": data,
      };

      const formDataFormat = new FormData();
      formDataFormat.append(
        "files",
        new Blob([JSON.stringify(manifest)], { type: "application/json" }),
        recentlyUploadedManifestFileName ? recentlyUploadedManifestFileName : CATEGORIES[category] + "-manifest" + generateRandomString() + "_" + name + ".json"
      );

      formDataFormat.append("category", CATEGORIES[category]);

      const response = await uploadFilesRequest(formDataFormat, tokenLogin?.nativeAuthToken || "");

      if (response.response) {
        if (response.response.data.statusCode === 402) {
          setErrors("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue");
          return undefined;
        } else {
          setErrors("There was an error uploading the file. " + response.response.data?.message);
          return undefined;
        }
      }

      // check here on how to add the errors form transform data function to the errors array
      if (response[0]) {
        let theResponse: { hash: string; folderHash: string; fileName: string; ipnsResponseHash?: string } = {
          hash: response[0]?.hash,
          folderHash: response[0]?.folderHash,
          fileName: response[0]?.fileName,
        };

        toast.success("Manifest file uploaded successfully");

        if (storageType?.includes("IPNS") || ipnsKey) {
          const ipnsResponse = await publishIpns(tokenLogin?.nativeAuthToken || "", response[0]?.hash, ipnsKey);

          if (ipnsResponse) {
            theResponse = { ...theResponse, ipnsResponseHash: ipnsResponse.hash };
            toast.success("IPNS published successfully");
          } else {
            toast.error("IPNS publishing failed");
          }
        }

        setResponsesOnSuccess(theResponse);
        setProgressValue(100);
      } else {
        throw new Error("The manifest file has not been uploaded correctly ");
      }
    } catch (error: any) {
      setErrors("Error generating the manifest file : " + (error instanceof Error) ? error.message : "");
      toast.error("Error generating the manifest file: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`);
      console.error("Error generating the manifest file:", error);
    }
  };

  function verifyHeaderFields() {
    if (!name || !creator || !createdOn) {
      toast.warning("Please fill all the fields from the header section");
      return false;
    }
    return true;
  }

  function handleUploadFileToIpfs() {
    if (verifyHeaderFields() === false) {
      return;
    }

    if (validateDataObjects() === false) {
      return;
    }

    document.getElementById("uploadButton")?.click();
    generateManifestFile();
  }

  // we don't support edit of SUI Walrus manifest files yet
  let isEditOfSUIWalrusAsset = false;

  if (manifestFile && manifestFile?.data_stream?.storageStrategy && manifestFile?.data_stream?.storageStrategy === SUI_WALRUS_STRATEGY_STRING) {
    isEditOfSUIWalrusAsset = true;
  }

  return (
    <div className="flex w-full flex-col">
      <ErrorBoundary
        onError={(err) => <ErrorFallbackMusicDataNfts error={err} />}
        FallbackComponent={({ error, resetErrorBoundary }) => <ErrorFallbackMusicDataNfts error={error} />}>
        <div className="flex flex-col mt-8 p-8 rounded-lg shadow-md w-[100%] bg-muted  justify-center items-center">
          {DataObjectsComponents}
          {addButton}
        </div>
      </ErrorBoundary>
      <button
        id="validateDataObjectsButton"
        onClick={handleUploadFileToIpfs}
        disabled={errorMessage != undefined || progressValue === 100 || isEditOfSUIWalrusAsset}
        className={"bg-accent text-accent-foreground w-full font-medium p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
        {manifestFile ? "Update Data" : "Upload Data"}
      </button>

      {isEditOfSUIWalrusAsset && (
        <p className="text-lg text-accent text-center mt-2">🚨 As SUI Walrus is in Beta, edits of the manifest file are not supported</p>
      )}
      <Modal
        openTrigger={<button id="uploadButton"></button>}
        modalClassName={"bg-background bg-muted !max-w-[60%] items-center justify-center border-accent/50"}
        footerContent={
          (errorMessage || errors) && <p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>
        }
        closeOnOverlayClick={false}>
        {
          <div className="flex flex-col gap-4 h-full text-foreground items-center justify-center pt-8">
            <span className="text-3xl">{progressValue}%</span>
            <Progress className="bg-background w-[40rem]" value={progressValue} />
            <span className="">
              {errorMessage
                ? "Uploading has stopped because of an error"
                : progressValue > 60
                  ? progressValue === 100
                    ? "Upload completed!"
                    : "Almost there..."
                  : "Uploading files..."}
            </span>
            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            {errors && <span className="text-red-500">{errors}</span>}

            {manifestCid && progressValue === 100 && (
              <div className="flex flex-col items-center justify-center mb-8 ">
                {progressValue === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <CidsView
                      ipnsHash={ipnsHash}
                      currentManifestFileCID={manifestCid}
                      folderCid={folderHash}
                      manifestFileName={recentlyUploadedManifestFileName}
                    />
                    <div className="flex flex-row justify-center items-center gap-4">
                      <Link
                        to={"/data-bunker"}
                        className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                        View stored files
                      </Link>
                      {ipnsHash ? (
                        <></>
                      ) : (
                        <Modal
                          modalClassName="w-[60%] border-accent/50"
                          openTrigger={
                            <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                              Update your DNS
                            </button>
                          }
                          closeOnOverlayClick={true}
                          footerContent={<p className={"px-8 border border-accent bg-background rounded-full hover:shadow hover:shadow-accent"}>Close</p>}>
                          {<NextStepsModal manifestCid={manifestCid} />}
                        </Modal>
                      )}
                    </div>
                    <a
                      className="bg-white text-black transition duration-500 hover:scale-110 cursor-pointer px-8 rounded-full font-semibold p-2 flex justify-center items-center gap-2"
                      href={"https://twitter.com/intent/tweet?" + tweetText}
                      data-size="large"
                      target="_blank">
                      Post on
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      </Modal>
    </div>
  );
};

export default DataObjectsList;
