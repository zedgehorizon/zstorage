import React from "react";
import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../libComponents/Button";

type MintDataNftModalProps = {
  triggerElement: React.ReactNode;
};

const MintDataNftModal: React.FC<MintDataNftModalProps> = ({ triggerElement }) => {
  return (
    <Modal
      closeOnOverlayClick={true}
      modalClassName=" w-[60%] border-accent/50   "
      title="Just one final step before your can mint your Itheum Music Data NFT"
      titleClassName="p-6 pb-0 mt-3 text-accent text-xl font-bold"
      openTrigger={triggerElement}>
      <div className="bg-background  rounded-lg shadow-md p-6">
        <p className="mb-4">
          Itheum Data NFT Minting is currently in "whitelist" mode, which means that you need to go through a simple whitelist process to ensure your NFT
          minting goes smoothly. Read more about this{" "}
          <a href="https://datadex.itheum.io/getwhitelisted" target="_blank" className="text-accent hover:underline">
            here
          </a>
          .
        </p>
        <p className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent">I am ready to mint, just tell me what I need to do now?</p>
          Take a few mins to fill this{" "}
          <a href="https://share-eu1.hsforms.com/1h2V8AgnkQJKp3tstayTsEAf5yjc" target="_blank" className="text-accent hover:underline">
            form
          </a>{" "}
          and a member of the Itheum protocol onboarding support team will reach out to you within 2 days to explain how to get your whitelisted.
        </p>
        <p className="mb-4">
          <p className="text-lg font-bold mb-4 text-accent"> I've filled the form, what happens next?</p>
          You should be in touch with someone from the Itheum protocol onboarding support team, if not, feel free to head over to Itheum's telegram on{" "}
          <a href="https://t.me/itheum" target="_blank" className="text-accent hover:underline">
            t.me/itheum
          </a>{" "}
          or their Discord on{" "}
          <a href="https://itheum.io/discord" target="_blank" className="text-accent hover:underline">
            itheum.io/discord
          </a>{" "}
          or just drop them an email direct on{" "}
          <a href="mailto:hello@itheum.io" target="_blank" className="text-accent hover:underline">
            hello@itheum.io
          </a>{" "}
          and check the status of your whitelist application.
        </p>
        <p className="mb-4">
          Once you have been whitelisted, you will be able to mint your Music Data NFT on datadex.itheum.io. The process is seamless and fast. Once your Music
          Data NFT is minted, you can continue to use ZedgeStorage to update the Music files and your fans (Data NFT token holders) can enjoy listening to your
          ever-evolving music streams.
        </p>
        <p className="text-lg font-bold mb-4 text-accent">What are you waiting for? Join the Itheum Music Data NFT revolution!</p>
      </div>
    </Modal>
  );
};

export default MintDataNftModal;
