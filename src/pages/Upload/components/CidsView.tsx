import { CopyIcon, ExternalLink } from "lucide-react";
import React from "react";
import { IPFS_GATEWAY } from "@utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@libComponents/Tooltip";
import { shortenAddress } from "@utils/functions";

interface CidsViewProps {
  folderCid?: string;
  currentManifestFileCID?: string;
  manifestFileName?: string;
  ipnsHash?: string;
}

const CidsView: React.FC<CidsViewProps> = (props) => {
  const { folderCid, currentManifestFileCID, manifestFileName, ipnsHash } = props;

  return (
    <div>
      {!ipnsHash ? (
        <>
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
        </>
      ) : (
        <div className="text-accent">
          <TooltipProvider>
            <div className="flex flex-row justify-center items-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
              <Tooltip>
                <TooltipTrigger className="flex flex-row">
                  <h3 className=" cursor-help ">Your Asset’s IPNS Location: </h3>
                </TooltipTrigger>{" "}
                <p className="ml-2 text-accent ">{"ipns/" + shortenAddress(ipnsHash, 20)}</p>
                <CopyIcon onClick={() => navigator.clipboard.writeText("ipns/" + ipnsHash)} className="ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
                <TooltipContent>
                  <p>Utilize this when minting data NFTs. Insert this into the "Data Stream URL" input field</p>
                </TooltipContent>
              </Tooltip>{" "}
            </div>{" "}
            <div className="flex flex-row justify-center items-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
              <Tooltip>
                <TooltipTrigger className="flex flex-row">
                  <h3 className=" cursor-help ">Your Asset on IPNS : </h3>
                </TooltipTrigger>{" "}
                <p className="ml-2 text-accent ">{IPFS_GATEWAY + "ipns/" + shortenAddress(ipnsHash, 10)}</p>
                <a href={IPFS_GATEWAY + "ipns/" + ipnsHash} target="_blank" className=" ml-4 font-semibold underline ">
                  <ExternalLink className="text-accent" />
                </a>
                <TooltipContent>
                  <p>Use this link to fetch the manifest through Ipns using the Lighthouse Gateway and check your newly created manifest</p>
                </TooltipContent>
              </Tooltip>{" "}
            </div>{" "}
            <div className="flex flex-row justify-center items-center w-full p-4 mt-4 bg-muted px-16 text-foreground/75 rounded-xl text-center border border-accent/40 font-light">
              <Tooltip>
                <TooltipTrigger className="flex flex-row">
                  <h3 className=" cursor-help ">Manifest CID : </h3>
                </TooltipTrigger>{" "}
                <p className="ml-2 text-accent ">{currentManifestFileCID}</p>
                <a href={IPFS_GATEWAY + "ipfs/" + currentManifestFileCID} target="_blank" className=" ml-4 font-semibold underline text-blue-500">
                  <ExternalLink className="text-accent" />
                </a>
                <TooltipContent>
                  <p>This CID is the target of the IPNS pointer, ensuring consistency between the two.</p>
                </TooltipContent>
              </Tooltip>{" "}
            </div>{" "}
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default CidsView;
