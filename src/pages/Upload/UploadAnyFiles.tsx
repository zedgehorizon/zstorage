import React, { useEffect, useState } from "react";
import UploadHeader from "./components/UploadHeader";
import { useLocation } from "react-router-dom";
import DragAndDropImageFiles from "./components/DragAndDropImageFiles";
import FileCard from "./components/FileCard";
import DataObjectsList from "./components/DataObjectsList";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";
import { uploadFilesRequest } from "../../utils/utils";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { theToken } from "../../utils/constants";

const UploadAnyFiles: React.FC = () => {
  const location = useLocation();
  const { tokenLogin } = useGetLoginInfo();

  const { currentManifestFileCID, manifestFile, action, type, template, storage, decentralized, version, manifestFileName, folderCid } = location.state || {};

  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);
  const [manifestCid, setManifestCid] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]); // State for array of files

  console.log(files);

  function addNewFile(file: File) {
    setFiles((prevFiles) => [...prevFiles, file]); // Add new file to the array
  }

  function deleteFile(index: number) {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1); // Remove file at the specified index
      return updatedFiles;
    });
  }

  async function uploadFiles() {
    const filesToUpload = new FormData();
    setProgressBar(17);
    try {
      //iterating over the songsData and for each object add its image and song to the formData
      Object.values(files).forEach((file, idx) => {
        filesToUpload.append("files", file, file.name);
      });
    } catch (error: any) {
      console.error("ERROR iterating through files : ", error);
      toast.error(
        "Error iterating through files : " +
          `${error ? error.message + ". " + error?.response?.data.message : ""}` +
          {
            icon: (
              <button onClick={() => toast.dismiss()}>
                <XCircle color="red" />
              </button>
            ),
          }
      );
    }

    if (filesToUpload.getAll("files").length === 0) return [];

    const response = await uploadFilesRequest(filesToUpload, theToken);
    console.log(response);
    return response;
  }

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
      <DragAndDropImageFiles setFile={addNewFile} className="w-full" />

      <DataObjectsList
        DataObjectsComponents={files.map((file, index) => (
          <FileCard key={index} index={index} fileName={file.name} fileSize={file.size} onDelete={() => deleteFile(index)} />
        ))}
        generateManifestFile={uploadFiles}
        isUploadButtonDisabled={files.length === 0}
        progressBar={progressBar}
        manifestCid={manifestCid}
      />
    </div>
  );
};
export default UploadAnyFiles;
