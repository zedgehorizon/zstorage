import { CopyIcon, ExternalLink } from "lucide-react";

// import MintDataNftModal from "../../../components/Modals/MintDataNftModal";
import { IPFS_GATEWAY } from "@utils/constants";
import { shortenAddress } from "@utils/functions";
import { WALRUS_GATEWAY } from "@utils/constants";

const StaticDataAssetCard: React.FC<StaticDataAsset> = (props) => {
  const { fileName, mimeType, hash, size, timestamp, id: walrusFileId, blobId: walrusBlobId } = props;

  let sizeToShow;
  if (size < 1024) {
    sizeToShow = `${size} bytes`;
  } else if (size < 1024 * 1024) {
    const sizeInKB = (size / 1024).toFixed(2);
    sizeToShow = `${sizeInKB} KB`;
  } else {
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    sizeToShow = `${sizeInMB} MB`;
  }

  return (
    <div className="truncate hover:shadow-inner hover:shadow-accent/50 bg-muted border border-accent/50 px-6 pb-2 pt-2 rounded-md  ">
      <div className="z-10 flex flex-row justify-between items-center border-b border-accent/30 p-2">
        <h2 className="text-2xl font-bold text-ellipsis whitespace-nowrap overflow-hidden">{fileName}</h2>
      </div>
      <div className="text-foreground/75 gap-2 p-2">
        <div className="w-full text-foreground/75 gap-2">
          <div className="w-full flex justify-between">
            <p className="truncate">Mime Type : {mimeType}</p>
            {walrusBlobId && (
              <div className="flex items-center">
                <p className="text-sm text-center bg-accent-foreground border border-accent text-accent rounded-xl px-2">Walrus</p>
              </div>
            )}
          </div>
          <p>Size: {sizeToShow}</p>
          <p>Created On: {new Date(timestamp * 1000).toDateString()}</p>
          <div className="flex flex-row gap-4">
            {hash && (
              <>
                <p>Cid: {shortenAddress(hash, 6)} </p>
                <CopyIcon
                  onClick={() => navigator.clipboard.writeText("ipfs://" + hash)}
                  className="ml-1 2xl:ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
              </>
            )}
            {walrusBlobId && (
              <>
                <p>Walrus Blob ID: {shortenAddress(walrusBlobId, 6)} </p>
                <CopyIcon onClick={() => navigator.clipboard.writeText(walrusBlobId)} className="ml-1 2xl:ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
              </>
            )}
          </div>
          <div className="flex flex-row gap-4">
            {hash && (
              <>
                <a href={IPFS_GATEWAY + "ipfs/" + hash} target="_blank" className="flex flex-row items-center hover:underline hover:text-accent ">
                  Check on IPFS
                  <ExternalLink className="text-accent ml-4 " />
                </a>
              </>
            )}
            {walrusBlobId && (
              <>
                <a href={WALRUS_GATEWAY + walrusBlobId} target="_blank" className="flex flex-row items-center hover:underline hover:text-accent ">
                  Check on Walrus
                  <ExternalLink className="text-accent ml-4 " />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {/* <MintDataNftModal
        triggerElement={
          <button className={"hover:scale-110 duration-300 transition text-xs p-2 px-4  text-accent border border-accent rounded-full"}>Mint Data NFT</button>
        }
      /> */}
    </div>
  );
};

export default StaticDataAssetCard;
