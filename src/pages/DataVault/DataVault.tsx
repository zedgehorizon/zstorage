import React from "react";
import { DataAssetList } from "./components/DataAssetsList";

// interface DataVaultProps {
//   data: any;
// }

const DataVault: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-[80%]">
      <div className="flex flex-row">
        <span className="text-4xl text-accent mt-8"> Your Data</span>
      </div>
      <DataAssetList />
    </div>
  );
};

export default DataVault;
