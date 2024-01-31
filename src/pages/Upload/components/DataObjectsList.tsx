import React, { useEffect } from "react";
import { Modal } from "../../../components/Modal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "../../../components/ErrorComponents/ErrorFallbackMusicDataNfts";
import { Progress } from "../../../libComponents/Progress";
import { Link } from "react-router-dom";
import { ToolTip } from "../../../libComponents/Tooltip";
import { CopyIcon } from "lucide-react";
import { IPFS_GATEWAY } from "../../../utils/constants";

interface DataObjectsListProps {
  DataObjectsComponents: React.ReactNode[];
  addButton?: React.ReactNode;
  isUploadButtonDisabled: boolean;
  progressBar: number;
  generateManifestFile: () => void;
  manifestCid?: string | null;
}

const DataObjectsList: React.FC<DataObjectsListProps> = (props) => {
  const { isUploadButtonDisabled, addButton, progressBar, DataObjectsComponents, manifestCid, generateManifestFile } = props;
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
  console.log(progressValue);
  return (
    <div className="flex w-full flex-col">
      <ErrorBoundary
        onError={(err) => <ErrorFallbackMusicDataNfts error={err} />}
        FallbackComponent={({ error, resetErrorBoundary }) => <ErrorFallbackMusicDataNfts error={error} />}>
        <div className="mt-8 p-8 rounded-lg shadow-md w-[100%] bg-muted ">
          {DataObjectsComponents}
          {addButton}
        </div>
      </ErrorBoundary>

      <Modal
        openTrigger={
          <button
            onClick={generateManifestFile}
            disabled={isUploadButtonDisabled || progressBar === 100}
            className={"bg-accent text-accent-foreground w-full font-medium  p-6 rounded-b-3xl disabled:cursor-not-allowed disabled:bg-accent/50"}>
            Upload Data
          </button>
        }
        modalClassName={"bg-background bg-muted !w-[40rem] items-center justify-center"}
        closeOnOverlayClick={false}>
        {
          <div className="flex flex-col gap-4 w-[40rem] text-foreground items-center justify-center">
            <span className="text-3xl">{progressValue}%</span>
            <Progress className="bg-background w-[60%] " value={progressValue}></Progress>
            <span className="">{progressBar > 60 ? (progressBar === 100 ? "Upload completed!" : "Amost there...") : "Uploading files to IPFS..."}</span>
            {manifestCid && (
              <div className="flex flex-col items-center justify-center p-8">
                {progressBar === 100 && (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <a href={IPFS_GATEWAY + manifestCid} target="_blank" className="text-lg font-light underline text-accent">
                      Click here to open manifest file
                    </a>

                    <ToolTip tooltip="It might take some time for the files to get pinned and to be visible on public gateways">
                      <div className="text-accent flex flex-row items-center justify-center gap-4">
                        <span className="max-w-[60%] overflow-hidden overflow-ellipsis">{manifestCid}</span>
                        <CopyIcon onClick={() => navigator.clipboard.writeText(manifestCid)} className="h-5 w-5 cursor-pointer text-accent" />
                      </div>
                    </ToolTip>
                    <Link
                      to={"/data-vault"}
                      className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                      View stored files
                    </Link>
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
