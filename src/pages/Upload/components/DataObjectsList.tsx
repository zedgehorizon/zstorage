import React, { useEffect } from "react";
import { Modal } from "../../../components/Modal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "../../../components/ErrorComponents/ErrorFallbackMusicDataNfts";
import { Progress } from "../../../libComponents/Progress";
import { Link } from "react-router-dom";
import CidsView from "./CidsView";
import NextStepsList from "../../../components/Lists/NextStepsList";

interface DataObjectsListProps {
  DataObjectsComponents: React.ReactNode[];
  addButton?: React.ReactNode;
  isUploadButtonDisabled: boolean;
  progressBar: number;
  uploadFileToIpfs: () => void;
  manifestCid?: string;
  folderHash?: string;
  recentlyUploadedManifestFileName?: string;
  ipnsHash?: string;
}

const DataObjectsList: React.FC<DataObjectsListProps> = (props) => {
  const {
    isUploadButtonDisabled,
    addButton,
    progressBar,
    DataObjectsComponents,
    manifestCid,
    recentlyUploadedManifestFileName,
    folderHash,
    ipnsHash,
    uploadFileToIpfs,
  } = props;
  const [progressValue, setProgressValue] = React.useState(0);

  // useEffect hook to load the progress bar smoothly to 100 in 10 seconds
  useEffect(() => {
    if (progressValue > 0 && progressValue < 99) {
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

  useEffect(() => {
    setProgressValue(progressBar);
  }, [progressBar]);

  return (
    <div className="flex w-full flex-col">
      <ErrorBoundary
        onError={(err) => <ErrorFallbackMusicDataNfts error={err} />}
        FallbackComponent={({ error, resetErrorBoundary }) => <ErrorFallbackMusicDataNfts error={error} />}>
        <div className="flex flex-col mt-8 p-8 rounded-lg shadow-md w-[100%] bg-muted  justify-center items-center ">
          {DataObjectsComponents}
          {addButton}
        </div>
      </ErrorBoundary>

      <Modal
        openTrigger={
          <button
            id="uploadButton"
            onClick={uploadFileToIpfs}
            disabled={isUploadButtonDisabled || progressBar === 100}
            className={"bg-accent text-accent-foreground w-full font-medium  p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
            Upload Data
          </button>
        }
        modalClassName={"bg-background bg-muted !max-w-[60%] h-fulll items-center justify-center border-accent/50"}
        closeOnOverlayClick={false}>
        {
          <div className="flex flex-col gap-4 h-full text-foreground items-center justify-center pt-8">
            <span className="text-3xl">{progressValue}%</span>
            <Progress className="bg-background w-[40rem]" value={progressValue}></Progress>
            <span className="">{progressValue > 60 ? (progressValue === 100 ? "Upload completed!" : "Amost there...") : "Uploading files..."}</span>
            {manifestCid && (
              <div className="flex flex-col items-center justify-center mb-8 ">
                {progressBar === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <CidsView
                      currentManifestFileCID={manifestCid}
                      folderCid={folderHash}
                      manifestFileName={recentlyUploadedManifestFileName}
                      ipnsHash={ipnsHash}
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
                          modalClassName="w-[40%] border-accent/50"
                          openTrigger={
                            <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                              Update your DNS
                            </button>
                          }
                          closeOnOverlayClick={true}>
                          {<NextStepsList manifestCid={manifestCid} />}
                        </Modal>
                      )}
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

export default DataObjectsList;
