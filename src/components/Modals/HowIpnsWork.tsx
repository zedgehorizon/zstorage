import { CopyIcon, ExternalLink, Lightbulb } from "lucide-react";
import React from "react";
import MintDataNftModal from "./MintDataNftModal";

interface HowIpnsWorkModalProps {
  ipnsHash: string;
}

const HowIpnsWorkModal: React.FC<HowIpnsWorkModalProps> = (props) => {
  const { ipnsHash } = props;
  return (
    <div className=" relative z-10 p-4 text-sm leading-relaxed text-white b rounded-3xl shadow-md">
      <div className="flex flex-row w-full justify-center items-center pb-4 border-b border-accent mb-4">
        <span className="font-bold text-lg  text-center">Understanding IPNS: A Guide to Immutable Naming and Content Updates</span>
        <Lightbulb className="text-accent" />
      </div>

      <div className="overflow-y-auto max-h-[25rem] p-8 ">
        <span className="font-bold text-lg  text-center justify-center">Connect your Data Asset directly to the Ipns instead of a domain :</span>
        <ul className="list-disc ml-4 mt-4">
          <li className="mb-4">
            <p className="font-bold">How Does IPNS Work?</p>
            <p>
              The InterPlanetary Name System (IPNS) provides a mechanism for establishing mutable pointers to Content Identifiers (CIDs). Think of IPNS names as
              dynamic links that can be updated over time, allowing for changes in the referenced content while maintaining the integrity and verification
              provided by content addressing. The manifest file CID will change, but the ipns hash will remain the same.
            </p>
          </li>
          <li>
            <p className="font-bold"> Your Ipns Public hash is: </p>
            <div className="text-accent text-sm  flex">
              {ipnsHash}
              <CopyIcon className="ml-5 h-5 w-5 cursor-pointer text-accent" onClick={() => navigator.clipboard.writeText(ipnsHash)} />
            </div>
            It can be used to access content stored on IPFS using a regular web browser. You can append the IPNS hash to the gateway URL to access the content
            e.g. https://gateway/ipns/ipnsHash
            <a
              href={"https://gateway.lighthouse.storage/ipns/" + ipnsHash}
              target="_blank"
              className="flex flex-row items-center  font-semibold underline text-accent mb-3">
              <p>Access your manifest file through Ipns </p>
              <ExternalLink className="ml-2 text-accent scale-75" />
            </a>
          </li>
          <li className="mb-4">
            <p className="font-bold">Immutable Address, Mutable Content:</p>
            <p>
              The IPNS hash remains constant, providing a stable reference to the content. However, the content itself can change over time. This is facilitated
              by the use of a manifest file associated with the IPNS hash. The manifest file contains the hash of the current version of the content.
            </p>
          </li>
          <li className="mb-4">
            <p className="font-bold">Content Updates:</p>
            <div>
              When the content is updated, a new version of the manifest file is generated with the updated hash. Despite these changes, the IPNS hash remains
              the same. This ensures that users can always access the latest version of the content by following the pointer in the manifest file.{" "}
            </div>
          </li>

          <li className="mb-4">
            <p className="font-bold">Mint Data Nft:</p>
            <p>Now that you have understood how IPNS works, you can mint your Data NFT using the IPNS hash and update it at any time with Zedge Storage. </p>
            <MintDataNftModal triggerElement={<button className={"underline text-accent text-lg font-bold"}>Check the whitelist!</button>} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HowIpnsWorkModal;
