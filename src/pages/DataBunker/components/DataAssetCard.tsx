import { Edit2 } from "lucide-react";

interface DataAsset {
  name: string;
  creator: string;
  created_on: string;
  last_modified_on: string;
  marshalManifest: {
    totalItems: number;
    nestedStream: boolean;
  };
}

interface DataAssetCardProps {
  dataAsset: DataAsset;
}

const DataAssetCard: React.FC<DataAssetCardProps> = ({ dataAsset }) => {
  const {
    name,
    creator,
    created_on,
    last_modified_on,
    marshalManifest: { totalItems, nestedStream },
  } = dataAsset;
  return (
    <div className="truncate hover:bg-accent/30  gap-4 bg-muted border border-accent/50 p-6 pb-2 rounded-md  ">
      <h2 className="text-2xl font-bold border-b border-accent/30 p-2">{name}</h2>
      <div className="text-foreground/75 gap-2 p-2">
        <p>Creator: {creator}</p>
        <p>Created On: {created_on}</p>
        <p>Last Modified On: {last_modified_on}</p>
        <p>Total Items: {totalItems}</p>
        <div className="flex flex-row justify-between">
          <p>Nested Stream: {nestedStream ? "Yes" : "No"}</p>
          <div className="-mt-2 p-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <Edit2 className="text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAssetCard;
