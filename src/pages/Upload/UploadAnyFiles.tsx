import React, { useEffect, useState } from "react";
import UploadHeader from "./components/UploadHeader";
import { useLocation } from "react-router-dom";
import DragAndDropImageFiles from "./components/DragAndDropImageFiles";
import FileCard from "./components/FileCard";
import DataObjectsList from "./components/DataObjectsList";

const UploadAnyFiles: React.FC = () => {
  const location = useLocation();

  const { currentManifestFileCID, manifestFile, action, type, template, storage, decentralized, version, manifestFileName, folderCid } = location.state || {};

  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);
  const [manifestCid, setManifestCid] = useState(null);
  const [file, setFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  console.log(file);
  return (
    <div className="flex flex-col">
      <UploadHeader
        title={manifestCid ? "Update" : "Upload" + " Data"}
        name={name}
        creator={creator}
        createdOn={createdOn}
        modifiedOn={modifiedOn}
        setName={setName}
        setCreator={setCreator}
        setCreatedOn={setCreatedOn}
      />
      <DragAndDropImageFiles setFile={setFile} />

      <DataObjectsList
        DataObjectsComponents={[
          <FileCard index={1} fileName={"IMG_3892.jpg"} fileSize={1233500} />,
          <FileCard index={1} fileName={"IMG_3892.jpg"} fileSize={1233500} />,
          <FileCard index={1} fileName={"IMG_3892.jpg"} fileSize={1233500} />,
        ]}
        isUploadButtonDisabled={false}
        progressBar={progressBar}
        generateManifestFile={() => {}}
        manifestCid={manifestCid}
      />
    </div>
  );
};

export default UploadAnyFiles;
