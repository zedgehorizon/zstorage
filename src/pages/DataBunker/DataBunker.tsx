import React from "react";
import { DataAssetList } from "./components/DataAssetsList";
import { FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";

const DataBunker: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-[80%] h-full min-h-[100svh] pb-16">
      <span className="text-4xl text-accent mt-8">Your Data Bunker</span>
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
