import React from "react";
import { DatePicker } from "../../../libComponents/DatePicker";
import CidsView from "./CidsView";
import { format } from "date-fns";
import { Modal } from "../../../components/Modal";
import NextStepsList from "../../../components/Lists/NextStepsList";
import { Button } from "../../../libComponents/Button";

interface UploadHeaderProps {
  title: string;
  name?: string;
  creator?: string;
  modifiedOn: string;
  createdOn?: string;
  setName: (name: string) => void;
  setCreator: (creator: string) => void;
  setCreatedOn: (createdOn: string) => void;

  folderCid?: string;
  currentManifestFileCID?: string;
  manifestFileName?: string;
}

const UploadHeader: React.FC<UploadHeaderProps> = (props) => {
  const { title, name, creator, createdOn, modifiedOn, setName, setCreator, setCreatedOn, currentManifestFileCID, folderCid, manifestFileName } = props;

  return (
    <div className="flex flex-col mx-auto">
      <h1 className="text-4xl text-accent font- pt-16 pb-8">{title} </h1>
      <div className="flex gap-x-4">
        <div className="mb-4  ">
          <label htmlFor="name" className="block text-foreground font-thin mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full fill-accent hover:text-accent text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent"
            required={true}
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
            onChange={(event) => setCreator(event.target.value)}
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
      {currentManifestFileCID && folderCid && (
        <Modal
          modalClassName="w-[70%] border-accent/50"
          openTrigger={
            <button className="transition duration-500 hover:scale-110 cursor-pointer bg-accent px-8  rounded-full text-accent-foreground font-semibold p-2">
              Instructions to Update your DNS
            </button>
          }
          footerContent={<Button className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</Button>}
          closeOnOverlayClick={true}>
          {<NextStepsList manifestCid={currentManifestFileCID || ""} />}
        </Modal>
      )}
      <CidsView folderCid={folderCid} currentManifestFileCID={currentManifestFileCID} manifestFileName={manifestFileName} />
    </div>
  );
};

export default UploadHeader;
