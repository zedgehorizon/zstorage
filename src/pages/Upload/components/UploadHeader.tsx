import React from "react";
import { DatePicker } from "../../../libComponents/DatePicker";
import { format } from "date-fns";
import { CopyIcon, ExternalLink } from "lucide-react";
import { IPFS_GATEWAY } from "../../../utils/constants";

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
          <DatePicker setterFunction={setCreatedOn} previousDate={createdOn} />
        </div>

        <div className="mb-4">
          <label htmlFor="modifiedOn" className="block text-foreground mb-2">
            Modified On:
          </label>
          <div className="w-full hover:text-accent text-center min-w-[10rem] text-accent/50 bg-background p-3 border border-accent/50 rounded focus:outline-none focus:border-accent">
            {modifiedOn}
          </div>
        </div>
      </div>
      <div>
        {folderCid && (
          <div className="flex flex-row justify-center items-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
            <h3 className="">Folder CID - {folderCid}</h3>
            <CopyIcon onClick={() => navigator.clipboard.writeText(folderCid)} className="ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
          </div>
        )}
        {currentManifestFileCID && (
          <div className="flex flex-row justify-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
            <h3>Manifest CID - {currentManifestFileCID} </h3>
            <CopyIcon onClick={() => navigator.clipboard.writeText(currentManifestFileCID)} className="ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
          </div>
        )}

        {manifestFileName && (
          <div className="flex flex-row justify-center items-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
            <h3>Manifest File Name - {manifestFileName} </h3>{" "}
            <CopyIcon onClick={() => navigator.clipboard.writeText(manifestFileName)} className="ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
            <a href={IPFS_GATEWAY + "ipfs/" + folderCid + "/" + manifestFileName} target="_blank" className=" ml-4 font-semibold underline text-blue-500">
              <ExternalLink className="text-accent" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadHeader;
