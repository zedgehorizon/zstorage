import React from "react";
import { DataAssetList } from "./components/DataAssetsList";
 
const DataVault: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-[80%] h-full min-h-screen">
      <span className="text-4xl text-accent mt-8"> Your Data</span>
      <DataAssetList />
    </div>
  );
};

export default DataVault;
