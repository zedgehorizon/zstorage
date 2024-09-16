import React from "react";
import { DataAssetList } from "./components/DataAssetsList";
import { FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useHeaderStore } from "store/header";
import { isRunningLowOnSpace } from "@utils/functions";

const DataBunker = () => {
  const { availableSpaceToUpload } = useHeaderStore((state: any) => ({
    availableSpaceToUpload: state.availableSpaceToUpload,
  }));

  const showGetFreeSpaceAlert = isRunningLowOnSpace(availableSpaceToUpload);

  return (
    <div className="flex flex-col gap-8 w-[80%] h-full min-h-[100svh] pb-16">
      {showGetFreeSpaceAlert && (
        <div className="text-lg mt-8 bg-accent p-3 text-black font-bold rounded-sm">
          💁🏾 Running out of Storage space? Reach out to us on the{" "}
          <a href="https://itheum.io/discord" target="_blank" className="underline hover:no-underline">
            Itheum Discord
          </a>{" "}
          to get some free bonus storage space. Limited time offer!
        </div>
      )}
      <div className="text-4xl text-accent mt-8">Your Data Bunker</div>
      <Link
        to="/storage"
        className="cursor-pointer hover:bg-accent/25 focus:bg-accent/75 p-4 bg-foreground/5 bg-opacity-5 rounded-lg border border-accent/25 w-[fit-content]">
        <div className="text-2xl flex">
          <FolderPlus size="40" className="mr-3" /> Create New Data Asset
        </div>
      </Link>
      <DataAssetList />
    </div>
  );
};

export default DataBunker;
