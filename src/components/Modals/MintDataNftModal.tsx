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
      title=" Just one final step before you can mint your Itheum Music Data NFT !"
      titleClassName="p-6 pb-0 mt-3 text-accent text-2xl font-bold"
      openTrigger={triggerElement}
      footerContent={<p className={"px-8 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Close</p>}>
      <div className="bg-background  rounded-lg shadow-md p-6">
        <div className="mb-4">
          Itheum Data NFT Minting is currently in "whitelist" mode, which means that you need to go through a simple whitelist process to ensure your NFT
          minting goes smoothly. Read more about this{" "}
          <a href="https://datadex.itheum.io/getwhitelisted" target="_blank" className="text-accent hover:underline">
            here
          </a>
          . Once you have been whitelisted to mint your Data NFT, your music Data NFTs will be available on NFT marketplaces like{" "}
          <a href="https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-04" target="_blank" className="text-accent hover:underline">
            Itheum's Data DEX
          </a>{" "}
          and be supported in web3 music platforms like{" "}
          <a href="https://explorer.itheum.io/nftunes" target="_blank" className="text-accent hover:underline">
            NF.Tunes
          </a>
        </div>
        <div className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent">I am ready to mint, just tell me what I need to do now?</p>
          Take a few mins to fill this{" "}
          <a href="https://share-eu1.hsforms.com/1h2V8AgnkQJKp3tstayTsEAf5yjc" target="_blank" className="text-accent hover:underline">
            form
          </a>{" "}
          and a member of the Itheum protocol onboarding support team will reach out to you within 2 days to explain how to get your whitelisted.{" "}
        </div>
        <div className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent"> I've filled the form, what happens next?</p>
          You should be in touch with someone from the Itheum protocol onboarding support team. If not, feel free to head over to Itheum's telegram at{" "}
          <a href="https://t.me/itheum" target="_blank" className="text-accent hover:underline">
            t.me/itheum
          </a>{" "}
          or their Discord at{" "}
          <a href="https://itheum.io/discord" target="_blank" className="text-accent hover:underline">
            itheum.io/discord
          </a>
          . Alternatively, you can email them directly at{" "}
          <a href="mailto:hello@itheum.io" target="_blank" className="text-accent hover:underline">
            hello@itheum.io
          </a>{" "}
          to check the status of your whitelist application.
        </div>
        <div className="mb-4">
          Once you have been whitelisted, you will be able to mint your Music Data NFT on{" "}
          <a href="https://datadex.itheum.io" target="_blank" className="text-accent hover:underline">
            datadex.itheum.io
          </a>{" "}
          . The process is seamless and fast. Once your Music Data NFT is minted, you can continue to use ZedgeStorage to update the music files, and your fans
          (Data NFT token holders) can enjoy listening to your ever-evolving music streams.
        </div>
        <p className="text-lg font-bold mb-4 text-accent">
          What are you waiting for? Join the Itheum Music Data NFT revolution!{" "}
          <a href="https://share-eu1.hsforms.com/1h2V8AgnkQJKp3tstayTsEAf5yjc" target="_blank" className="text-accent underline">
            Apply for a mint whitelist today!
          </a>{" "}
        </p>
      </div>
    </Modal>
  );
};

export default MintDataNftModal;
