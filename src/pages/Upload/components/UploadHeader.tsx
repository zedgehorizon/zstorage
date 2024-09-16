import React, { useEffect } from "react";
import { DatePicker } from "@libComponents/DatePicker";
import CidsView from "./CidsView";
import { format, set } from "date-fns";
import { Modal } from "@components/Modal";
import NextStepsModal from "@components/Modals/NextStepsModal";
import { Switch } from "@libComponents/Switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@libComponents/Tooltip";
import HowIpnsWorkModal from "@components/Modals/HowIpnsWork";
import { useHeaderStore } from "store/header";

interface UploadHeaderProps {
  title: string;
  folderCid?: string;
  currentManifestFileCID?: string;
  manifestFileName?: string;
  ipnsHash?: string;
  dataStream?: any;
  setModificationMadeInHeader?: (value: boolean) => void;
  disableStream?: boolean;
}

const UploadHeader: React.FC<UploadHeaderProps> = (props) => {
  const { title, currentManifestFileCID, folderCid, manifestFileName, ipnsHash, dataStream, setModificationMadeInHeader, disableStream } = props;
  const { name, creator, modifiedOn, createdOn, stream, updateName, updateCreator, updateCreatedOn, updateStream, updateModifiedOn } = useHeaderStore(
    (state: any) => ({
      name: state.name,
      creator: state.creator,
      modifiedOn: state.modifiedOn,
      createdOn: state.createdOn,
      stream: state.stream,
      updateName: state.updateName,
      updateCreator: state.updateCreator,
      updatemodifiedOn: state.updatemodifiedOn,
      updateCreatedOn: state.updateCreatedOn,
      updateStream: state.updateStream,
      updateModifiedOn: state.updateModifiedOn,
    })
  );

  useEffect(() => {
    if (dataStream) {
      updateName(dataStream?.name);
      updateCreator(dataStream?.creator);
      updateCreatedOn(dataStream?.created_on);
      updateModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
      updateStream(dataStream.marshalManifest.nestedStream);
    } else {
      updateName("");
      updateCreator("");
      updateCreatedOn("");
      updateModifiedOn(new Date().toISOString().split("T")[0]);
      updateStream(true);
    }
  }, [dataStream]);

  useEffect(() => {
    if (setModificationMadeInHeader) {
      if (
        dataStream?.name !== name ||
        dataStream?.creator !== creator ||
        dataStream?.created_on !== createdOn ||
        dataStream?.marshalManifest.nestedStream !== stream
      ) {
        setModificationMadeInHeader(true);
      } else setModificationMadeInHeader(false);
    }
  }, [name, creator, createdOn, modifiedOn, stream]);

  return (
    <div className="flex flex-col mx-auto">
      <div className="flex flex-row pt-16 pb-8 justify-between">
        <h1 className="text-4xl text-accent">{title} </h1>
        <div className="flex flex-col">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <label className="block text-foreground mb-2 cursor-help ">Nested Stream</label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data Stream will be "dynamic" where it can evolve to have its data change</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Switch checked={stream} disabled={disableStream} defaultChecked={true} onCheckedChange={updateStream} className=" mx-auto" />
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
            onChange={(event) => updateName(event.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
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
            onChange={(event) => updateCreator(event.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))}
            className="w-full fill-accent hover:text-accent text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
            required={true}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="text-foreground mb-2 ">Created On:</label>
          <DatePicker setterFunction={updateCreatedOn} previousDate={createdOn ? createdOn : ""} />
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
            <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8 rounded-full text-accent-foreground font-semibold p-2">
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
