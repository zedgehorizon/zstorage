import React, { useEffect, useState } from "react";
import UploadHeader from "./components/UploadHeader";
import { useLocation } from "react-router-dom";
import DragAndDropZone from "./components/DragAndDropZone";
import FileCard from "./components/FileCard";
import DataObjectsList from "./components/DataObjectsList";
import { toast } from "sonner";
import { generateRandomString, uploadFilesRequest, onlyAlphaNumericChars } from "@utils/functions";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { CATEGORIES, IPFS_GATEWAY } from "@utils/constants";
import { useHeaderStore } from "store/header";

type FileData = {
  idx: number;
  name: string;
  file: string;
  date: string;
  mime_type: string;
  size: number;
};

const UploadAnyFiles = () => {
  const currentCategory = 0; // anyfile
  const location = useLocation();
  const { tokenLogin } = useGetLoginInfo();
  const { manifestFile, decentralized } = location.state || {};
  const manifestFileName = manifestFile?.manifestFileName;
  const folderCid = manifestFile?.folderHash;
  const currentManifestFileCID = manifestFile?.hash;

  //header
  const { updateName, updateCreator, updateModifiedOn, updateCreatedOn, updateStream } = useHeaderStore((state: any) => ({
    updateName: state.updateName,
    updateCreator: state.updateCreator,
    updateModifiedOn: state.updateModifiedOn,
    updateCreatedOn: state.updateCreatedOn,
    updateStream: state.updateStream,
  }));

  const [manifestCid, setManifestCid] = useState<string>();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState<string>();
  const [folderHash, setFolderHash] = useState<string>();
  const [ipnsHash, setIpnsHash] = useState<string>();
  const [totalItems, setTotalItems] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [files, setFiles] = useState<Record<number, File>>({}); //files to upload
  const [fileObjects, setFileObjects] = useState<Record<number, FileData>>({}); // all files from manifest file
  const [errorMessage, setErrorMessage] = useState<string>();

  // populate the fileObjects with the files from the manifest file and the header
  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        updateName(dataStream.name);
        updateCreator(dataStream.creator);
        updateCreatedOn(dataStream.created_on);
        updateModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        updateStream(dataStream.marshalManifest.nestedStream);

        setTotalItems(dataStream.marshalManifest.totalItems);
        setNextIndex(dataStream.marshalManifest.totalItems + 1);
        setIpnsHash(manifestFile.ipnsHash);
        setRecentlyUploadedManifestFileName(manifestFile.manifestFileName);
        const filesMap = manifestFile.data.reduce(
          (acc: any, file: any) => {
            if (file) acc[file.idx] = file;
            return acc;
          },
          {} as Record<number, FileData>
        );
        setFileObjects(filesMap);
      } catch (err: any) {
        console.error("ERROR parsing manifest file : ", err);
        setErrorMessage("Error parsing manifest file. Invalid format manifest file fetched : " + (err instanceof Error) ? err.message : "");
        toast.error("Error parsing manifest file. Invalid format manifest file fetched : " + (err instanceof Error) ? err.message : "");
      }
    } else {
      updateName("");
      updateCreator("");
      updateCreatedOn("");
      updateModifiedOn(new Date().toISOString().split("T")[0]);
      updateStream(true);
    }
  }, [manifestFile]);

  function addNewFiles(files: File[]) {
    Array.from(files).forEach((file, index) => {
      const newIndex = nextIndex + index;
      setFiles((prevFiles) => {
        return {
          ...prevFiles,
          [newIndex]: file,
        };
      });

      setFileObjects((prevFileObjects) => {
        const updatedFileObjects = { ...prevFileObjects };
        updatedFileObjects[newIndex] = {
          idx: newIndex,
          name: file.name,
          file: file.name,
          date: new Date().toISOString(),
          mime_type: file.type,
          size: file.size,
        };
        return updatedFileObjects;
      });
    });

    setTotalItems((prev) => prev + files.length);
    setNextIndex((prev) => prev + files.length);
  }

  function deleteFile(index: number) {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      delete updatedFiles[index];
      return updatedFiles;
    });

    setFileObjects((prevFileObjects) => {
      const updatedFileObjects = { ...prevFileObjects };
      delete updatedFileObjects[index];
      return updatedFileObjects;
    });
    setTotalItems((prev) => prev - 1);
  }

  async function uploadFiles() {
    const filesToUpload = new FormData();
    try {
      Object.values(files).forEach((file) => {
        filesToUpload.append("files", file, generateRandomString() + "_" + onlyAlphaNumericChars(file.name.split(".")[0]) + "." + file.name.split(".")[1]);
      });
    } catch (error: any) {
      console.error("ERROR iterating through files : ", error);
      setErrorMessage("Error iterating through files : " + (error instanceof Error) ? error.message : "");
      toast.error("Error iterating through files : " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
    }
    if (filesToUpload.getAll("files").length === 0) return [];
    filesToUpload.append("category", CATEGORIES[currentCategory]); // anyfile
    const response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "");
    if (response.response) {
      if (response.response.data.statusCode === 402) {
        setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue");
        return undefined;
      } else {
        setErrorMessage("There was an error uploading the file. " + response.response.data?.message);
        return undefined;
      }
    }
    return response;
  }

  async function transformFilesToDataArray() {
    try {
      const responseDataCIDs = await uploadFiles();
      if (!responseDataCIDs) return;

      const transformedData = Object.keys(fileObjects).map((key: any, index: number) => {
        const fileObj: FileData = fileObjects[key - 1 + 1];

        if (fileObj && fileObj?.name) {
          let matchingObj;

          const fileToUpload = files[key];

          if (fileToUpload) {
            matchingObj = responseDataCIDs.find((uploadedFileObj: any) =>
              uploadedFileObj.fileName.includes(onlyAlphaNumericChars(fileToUpload.name.split(".")[0]))
            );
            if (!matchingObj) throw new Error("The data has not been uploaded correctly. CID could not be found for file - " + fileToUpload.name);
          }
          return {
            idx: index + 1,
            name: matchingObj ? matchingObj.fileName : fileObj?.name,
            file: matchingObj ? `${IPFS_GATEWAY}ipfs/${matchingObj.folderHash}/${matchingObj.fileName}` : fileObj.file,
            date: fileObj.date ? new Date(fileObj.date).toISOString() : new Date().toISOString(),
            mime_type: fileObj?.mime_type,
            size: fileObj?.size,
          };
        }
      });
      return transformedData.filter((file: any) => file !== null);
    } catch (error: any) {
      setErrorMessage("Error transforming the data : " + (error instanceof Error) ? error.message : "");
      toast.error("Error transforming the data: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`);
      console.error("ERROR transforming the data: ", error);
    }
  }

  function setResponsesOnSuccess(response: { hash: string; folderHash: string; fileName: string; ipnsResponseHash?: string }) {
    setManifestCid(response?.hash);
    setFolderHash(response?.folderHash);
    setRecentlyUploadedManifestFileName(response?.fileName);
    if (response.ipnsResponseHash) setIpnsHash(response.ipnsResponseHash);
  }
  return (
    <div className="flex  flex-col  h-full pb-16">
      <UploadHeader
        title={manifestFile ? "Update" : "Upload" + " Data"}
        folderCid={folderCid}
        manifestFileName={manifestFileName}
        currentManifestFileCID={currentManifestFileCID}
        ipnsHash={ipnsHash}
      />
      <DragAndDropZone addMultipleFiles={addNewFiles} dropZoneStyles="w-full" />
      <div className="flex justify-center items-center">
        <DataObjectsList
          DataObjectsComponents={Object.keys(fileObjects)
            .reverse()
            .map((key: any, index: number) => {
              return (
                <FileCard
                  key={index}
                  index={totalItems - index}
                  fileName={fileObjects[key - 1 + 1].name}
                  fileSize={fileObjects[key - 1 + 1].size}
                  onDelete={() => deleteFile(key - 1 + 1)}
                />
              );
            })}
          transformFilesToDataArray={transformFilesToDataArray}
          setResponsesOnSuccess={setResponsesOnSuccess}
          manifestCid={manifestCid}
          folderHash={folderHash}
          recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
          ipnsHash={ipnsHash}
          ipnsKey={manifestFile?.ipnsKey}
          errorMessage={errorMessage}
          storageType={decentralized}
          category={0} // anyfile
          validateDataObjects={() => true}
        />
      </div>
    </div>
  );
};
export default UploadAnyFiles;
