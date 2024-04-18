import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragAndDropZone from "./components/DragAndDropZone";
import FileCard from "./components/FileCard";
import { onlyAlphaNumericChars, uploadFilesRequest } from "@utils/functions";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { CATEGORIES } from "@utils/constants";
import { Modal } from "@components/Modal";
import { Progress } from "@libComponents/Progress";
import CidsView from "./components/CidsView";

const UploadStaticData = () => {
  const [file, setFile] = useState<File | null>(null);
  const { tokenLogin } = useGetLoginInfo();
  const [progressValue, setProgressValue] = useState(0);
  const [fileCid, setFileCid] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (progressValue > 0 && progressValue < 99 && !errorMessage) {
      const interval = 100; // Time interval in milliseconds
      const totalTime = 5000; // Total time for the progress to reach 100 (in milliseconds) - 5 seconds
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

  async function uploadFile() {
    setProgressValue(43);
    if (!file) return;
    const filesToUpload = new FormData();
    filesToUpload.append("files", file, onlyAlphaNumericChars(file.name.split(".")[0]) + "." + file.name.split(".")[1]);
    filesToUpload.append("category", CATEGORIES[3]); // static data

    const response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "");

    if (response.response) {
      if (response.response.data.statusCode === 402) {
        setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue.");
        return undefined;
      } else {
        setErrorMessage("There was an error uploading the file. " + response.response.data?.message);
        return undefined;
      }
    }
    setProgressValue(100);
    setFileCid(response[0].hash);
  }

  return (
    <div className="w-full xl:w-[60%]">
      <h1 className="text-4xl text-accent mb-8">Upload Static Data to IPFS</h1>
      <DragAndDropZone setFile={setFile} dropZoneStyles="w-full" />
      {file && (
        <div className="w-full flex items-center justify-center">
          {" "}
          <FileCard fileName={file?.name} fileSize={file?.size} index={1} onDelete={() => setFile(null)} />{" "}
        </div>
      )}
      <Modal
        openTrigger={
          <button
            id="validateDataObjectsButton"
            onClick={uploadFile}
            disabled={!file || progressValue > 0 || errorMessage != undefined}
            className={"bg-accent text-accent-foreground w-full font-medium p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
            Upload Data
          </button>
        }
        footerContent={errorMessage && <p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}
        modalClassName={"bg-background bg-muted !max-w-[60%]  items-center justify-center border-accent/50"}
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
            {fileCid && progressValue === 100 && (
              <div className="flex flex-col items-center justify-center mb-8 ">
                {progressValue === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <CidsView fileCID={fileCid} />
                    <div className="flex flex-row justify-center items-center gap-4">
                      <Link
                        to={"/data-bunker"}
                        className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                        View stored files
                      </Link>
                    </div>
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
export default UploadStaticData;
