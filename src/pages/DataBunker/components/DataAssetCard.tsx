import { Edit2, PlaySquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../libComponents/Button";
import { Modal } from "../../../components/Modal";
import { AudioPlayerPreview } from "../../../components/AudioPlayerPreview";

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
  manifest: any;
  category: number;
}

const DataAssetCard: React.FC<DataAssetCardProps> = (props) => {
  const { manifest, category } = props;
  const dataAsset = manifest?.data_stream;
  const {
    name,
    creator,
    created_on,
    last_modified_on,
    marshalManifest: { totalItems, nestedStream },
  } = dataAsset;

  return (
    <div className="truncate hover:bg-accent/10  gap-4 bg-muted border border-accent/50 p-6 pb-2 rounded-md  ">
      <div className="z-10 flex flex-row justify-between border-b border-accent/30 p-2">
        <h2 className="text-2xl font-bold ">{name}</h2>
        {category === 1 && (
          <Modal
            closeOnOverlayClick={true}
            modalClassName="p-0 m-0 max-w-[80%]"
            title="Preview Music Data NFTs"
            titleClassName="px-8 mt-3"
            openTrigger={
              <Button className="p-0 m-0 ">
                <PlaySquare className="text-accent w-8 h-8 hover:scale-125 transition cursor-pointer" />
              </Button>
            }
            footerContent={
              <div className="flex flex-row p-2 gap-8 justify-center items-center w-full -mt-16 ">
                <Button className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Back</Button>
                <Link
                  to={"/upload-music"}
                  state={{
                    manifestFile: manifest,
                    action: "Update Asset",
                    currentManifestFileCID: manifest.hash,
                    manifestFileName: manifest.manifestFileName,
                    folderCid: manifest.folderHash,
                  }}>
                  <div className="px-8 mt-8 p-2 border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent">Start edit</div>
                </Link>
              </div>
            }>
            <div className="flex flex-col h-[30rem] scale-[0.7] -mt-16">
              <AudioPlayerPreview
                songs={Object.values(manifest.data).map((songData) => {
                  return songData;
                })}
              />
            </div>
          </Modal>
        )}
      </div>
      <div className="text-foreground/75 gap-2 p-2">
        <p>Creator: {creator}</p>
        <p>Created On: {created_on}</p>
        <p>Last Modified On: {last_modified_on}</p>
        <p>Total Items: {totalItems}</p>
        <div className="flex flex-row justify-between">
          <p>Nested Stream: {nestedStream ? "Yes" : "No"}</p>
          <Link
            to={"/upload-music"}
            state={{
              manifestFile: manifest,
              action: "Update Asset",
              currentManifestFileCID: manifest.hash,
              manifestFileName: manifest.manifestFileName,
              folderCid: manifest.folderHash,
            }}>
            <div className="hover:scale-125 transition -mt-2 p-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <Edit2 className="text-accent" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataAssetCard;
