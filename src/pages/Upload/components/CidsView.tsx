import { CopyIcon, ExternalLink } from "lucide-react";
import React from "react";
import { IPFS_GATEWAY } from "../../../utils/constants";

interface CidsViewProps {
  folderCid?: string;
  currentManifestFileCID?: string;
  manifestFileName?: string;
}

const CidsView: React.FC<CidsViewProps> = (props) => {
  const { folderCid, currentManifestFileCID, manifestFileName } = props;

  return (
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
  );
};

export default CidsView;
