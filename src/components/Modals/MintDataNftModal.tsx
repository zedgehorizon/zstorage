import React from "react";
import { Modal } from "@components/Modal";

type MintDataNftModalProps = {
  triggerElement: React.ReactNode;
};

const MintDataNftModal: React.FC<MintDataNftModalProps> = ({ triggerElement }) => {
  return (
    <Modal
      closeOnOverlayClick={true}
      modalClassName="h-full w-[60%] border-accent/50 overflow-y-auto max-h-[80svh]"
      title="Mint your Itheum Data NFT!"
      titleClassName="p-6 pb-0 mt-3 text-accent text-2xl font-bold"
      openTrigger={triggerElement}
      footerContent={<p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}>
      <div className="bg-background rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent">How to Mint a Data NFT - Tutorial</p>
          Anyone can mint Data NFT on the Itheum Protocol as it's a fully open and decentralized protocol. You can follow a short, end-to-end video tutorial on
          how to mint a Data NFT -{" "}
          <a
            href="https://docs.itheum.io/product-docs/product/data-dex/minting-a-data-nft/store-data-and-mint-a-data-nft-step-by-step-tutorial"
            target="_blank"
            className="text-accent hover:underline">
            Open Tutorial
          </a>
        </div>
        <div className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent">How to Mint a Data NFT - Use the Itheum Data DEX</p>
          When you are ready to proceed, you can access the{" "}
          <a href="https://datadex.itheum.io/" target="_blank" className="text-accent hover:underline">
            Data DEX
          </a>{" "}
          and mint your Data NFT. If you need any help from the Itheum community, you can join their Discord on{" "}
          <a href="https://itheum.io/discord" target="_blank" className="text-accent hover:underline">
            https://itheum.io/discord
          </a>
          . Note that if you are minting a Music Data NFTs, they can also be supported for free on web3 music platforms like{" "}
          <a href="https://explorer.itheum.io/nftunes" target="_blank" className="text-accent hover:underline">
            NF.Tunes
          </a>{" "}
          - just inform the Itheum community via Discord above.
        </div>
        <p className="text-lg font-bold mb-4 text-accent">What are you waiting for? Join the Data NFT revolution! </p>
      </div>
    </Modal>
  );
};

export default MintDataNftModal;
