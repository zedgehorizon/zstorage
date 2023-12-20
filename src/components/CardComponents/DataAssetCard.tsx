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
    <div className="truncate  hover:bg-sky-400/30  gap-4 bg-black bg-opacity-20 border border-sky-400 p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <div className="text-foreground">
        <p>Creator: {creator}</p>
        <p>Created On: {created_on}</p>
        <p>Last Modified On: {last_modified_on}</p>
        <p>Total Items: {totalItems}</p>
        <p>Nested Stream: {nestedStream ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default DataAssetCard;
