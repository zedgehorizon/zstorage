import { CopyIcon, ExternalLink } from "lucide-react";

import MintDataNftModal from "../../../components/Modals/MintDataNftModal";
import { IPFS_GATEWAY } from "@utils/constants";
import { shortenAddress } from "@utils/functions";

const StaticDataAssetCard: React.FC<MetaPairDataAssetSet> = (props) => {
  console.log(props, "props");
  const { fileName: imgFileName, mimeType: imgMimeType, hash: imgHash, size: imgSize, timestamp: imgTimestamp } = props.img;
  const { fileName: jsonFileName, mimeType: jsonMimeType, hash: jsonHash, size: jsonSize, timestamp: jsonTimestamp } = props.json;

  /*

{
            "uuid": 3407,
            "hash": "bafkreieyui4oxmcmjxsfmzo27qoho55mabqhn7uodgusyc6d3kofx6a6qy",
            "fileName": "FANG82.jpg",
            "mimeType": "image/jpeg",
            "address": "erd1w9y0c00lw9yu3pxyu7vglysun8p4g6hu3c2d6lrnq3q9qf5sagqq5a6y5y",
            "folderHash": "bafybeic4vfkyenehhsfn5dtvgzpzgywqbw2z3verq54dw5wwg4fwxkc7ky",
            "timestamp": 1749367710,
            "category": "datatoken_metapair",
            "size": 21611
        },
        {
            "uuid": 3408,
            "hash": "bafkreidmib7siqtmycsz6d3xtbw3va6hqozomqki7ba7w3bo35xy47whza",
            "fileName": "FANG82.json",
            "mimeType": "application/octet-stream",
            "address": "erd1w9y0c00lw9yu3pxyu7vglysun8p4g6hu3c2d6lrnq3q9qf5sagqq5a6y5y",
            "folderHash": "bafybeic4vfkyenehhsfn5dtvgzpzgywqbw2z3verq54dw5wwg4fwxkc7ky",
            "timestamp": 1749367711,
            "category": "datatoken_metapair",
            "size": 1618
        }

*/

  let sizeToShow;
  if (imgSize < 1024) {
    sizeToShow = `${imgSize} bytes`;
  } else if (imgSize < 1024 * 1024) {
    const sizeInKB = (imgSize / 1024).toFixed(2);
    sizeToShow = `${sizeInKB} KB`;
  } else {
    const sizeInMB = (imgSize / (1024 * 1024)).toFixed(2);
    sizeToShow = `${sizeInMB} MB`;
  }

  return (
    <div className="truncate hover:shadow-inner hover:shadow-accent/50 bg-muted border border-accent/50 px-6 pb-2 pt-2 rounded-md  ">
      <div className="z-10 flex flex-row justify-between items-center border-b border-accent/30 p-2">
        <h2 className="text-2xl font-bold text-ellipsis whitespace-nowrap overflow-hidden">
          {imgFileName} / {jsonFileName}
        </h2>
      </div>
      <div className="text-foreground/75 gap-2 p-2">
        <div className="w-full text-foreground/75 gap-2  ">
          <p className="truncate">
            Mime Type : {imgMimeType} / {jsonMimeType}
          </p>
          <p>
            Size: {imgSize} / {jsonSize}
          </p>
          <p>Created On: {new Date(imgTimestamp * 1000).toDateString()}</p>
          <>
            <div className="flex flex-row">
              <p>Img Cid: {shortenAddress(imgHash, 6)} </p>
              <CopyIcon
                onClick={() => navigator.clipboard.writeText("ipfs://" + imgHash)}
                className=" ml-1 2xl:ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
            </div>
            <a href={IPFS_GATEWAY + "ipfs/" + imgHash} target="_blank" className="flex flex-row items-center hover:underline hover:text-accent ">
              Check on IPFS
              <ExternalLink className="text-accent ml-4 " />
            </a>
          </>
          <>
            <div className="flex flex-row">
              <p>JSON Cid: {shortenAddress(jsonHash, 6)} </p>
              <CopyIcon
                onClick={() => navigator.clipboard.writeText("ipfs://" + jsonHash)}
                className=" ml-1 2xl:ml-4 h-5 w-5 cursor-pointer text-accent"></CopyIcon>
            </div>
            <a href={IPFS_GATEWAY + "ipfs/" + jsonHash} target="_blank" className="flex flex-row items-center hover:underline hover:text-accent ">
              Check on IPFS
              <ExternalLink className="text-accent ml-4 " />
            </a>
          </>
        </div>
      </div>
    </div>
  );
};

export default StaticDataAssetCard;
