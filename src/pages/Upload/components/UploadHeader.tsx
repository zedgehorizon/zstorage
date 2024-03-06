import React from "react";
import { DatePicker } from "@libComponents/DatePicker";
import CidsView from "./CidsView";
import { format } from "date-fns";
import { Modal } from "@components/Modal";
import NextStepsModal from "@components/Modals/NextStepsModal";
import { Switch } from "@libComponents/Switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@libComponents/Tooltip";
import HowIpnsWorkModal from "@components/Modals/HowIpnsWork";

interface UploadHeaderProps {
  title: string;
  name?: string;
  creator?: string;
  modifiedOn: string;
  createdOn?: string;
  stream?: boolean;
  setName: (name: string) => void;
  setCreator: (creator: string) => void;
  setCreatedOn: (createdOn: string) => void;
  setStream?: (stream: boolean) => void;
  folderCid?: string;
  currentManifestFileCID?: string;
  manifestFileName?: string;
  ipnsHash?: string;
}

const UploadHeader: React.FC<UploadHeaderProps> = (props) => {
  const {
    title,
    name,
    creator,
    createdOn,
    modifiedOn,
    stream,
    setName,
    setCreator,
    setCreatedOn,
    setStream,
    currentManifestFileCID,
    folderCid,
    manifestFileName,
    ipnsHash,
  } = props;

  return (
    <div className="flex flex-col mx-auto">
      <div className="flex flex-row pt-16 pb-8 justify-between">
        <h1 className="text-4xl text-accent">{title} </h1>
        <div className="flex flex-col">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <label className="block text-foreground mb-2 cursor-help ">Stream</label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data Stream will be "dynamic" where it can evolve to have its data change</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Switch disabled={setStream ? false : true} checked={stream} defaultChecked={true} onCheckedChange={setStream} className=" mx-auto" />
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className="mb-4  ">
          <label htmlFor="name" className="block text-foreground font-thin mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            pattern="[a-zA-Z0-9\s] "
            value={name}
            onChange={(event) => setName(event.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))}
            className="w-full fill-accent hover:text-accent text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="creator" className="block text-foreground mb-2">
            Creator:
          </label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={creator}
            onChange={(event) => setCreator(event.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))}
            className="w-full fill-accent hover:text-accent text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
            required={true}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="text-foreground mb-2 ">Created On:</label>
          <DatePicker setterFunction={setCreatedOn} previousDate={createdOn ? createdOn : undefined} />
        </div>

        <div className="mb-4">
          <label htmlFor="modifiedOn" className="block text-foreground mb-2">
            Modified On:
          </label>
          <div className="w-full hover:text-accent text-center min-w-[10rem] text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent">
            {format(modifiedOn, "dd/MM/yyyy")}
          </div>
        </div>
      </div>
      {currentManifestFileCID && folderCid && ipnsHash ? (
        <Modal
          modalClassName="w-[70%] border-accent/50"
          openTrigger={
            <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
              How IPNS works?
            </button>
          }
          footerContent={<p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}
          closeOnOverlayClick={true}>
          {<HowIpnsWorkModal ipnsHash={ipnsHash} />}
        </Modal>
      ) : (
        currentManifestFileCID &&
        folderCid && (
          <Modal
            modalClassName="w-[70%] border-accent/50"
            openTrigger={
              <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
                Instructions to Update your DNS
              </button>
            }
            footerContent={<p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}
            closeOnOverlayClick={true}>
            {<NextStepsModal manifestCid={currentManifestFileCID || ""} />}
          </Modal>
        )
      )}
      <CidsView folderCid={folderCid} currentManifestFileCID={currentManifestFileCID} manifestFileName={manifestFileName} ipnsHash={ipnsHash} />
    </div>
  );
};

export default UploadHeader;
