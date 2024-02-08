import React, { useEffect, useState } from "react";
import UploadHeader from "./components/UploadHeader";
import { useLocation } from "react-router-dom";
import DragAndDropImageFiles from "./components/DragAndDropImageFiles";
import FileCard from "./components/FileCard";
import DataObjectsList from "./components/DataObjectsList";
import toast from "react-hot-toast";
import { Lightbulb, XCircle } from "lucide-react";
import { generateRandomString, uploadFilesRequest } from "../../utils/utils";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { CATEGORIES, IPFS_GATEWAY } from "../../utils/constants";

import pdfFile from "../../assets/logo/document-type/pdf.png";
import docFile from "../../assets/logo/document-type/doc.png";
import imageFile from "../../assets/logo/document-type/music.png";
import musicFile from "../../assets/logo/document-type/music.png";

type FileData = {
  idx: number;
  name: string;
  file: string;
  date: string;
  mime_type: string;
  size: number;
};

const UploadAnyFiles: React.FC = () => {
  const currentCategory = 0; // anyfile
  const location = useLocation();
  const { tokenLogin } = useGetLoginInfo();
  const theToken = tokenLogin?.nativeAuthToken;
  const { currentManifestFileCID, manifestFile, action, type, template, storage, decentralized, version, manifestFileName, folderCid } = location.state || {};

  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);
  const [manifestFileIpfsUrl, setManifestFileIpfsUrl] = useState();
  const [manifestCid, setManifestCid] = useState();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState<string>();
  const [folderHash, setFolderHash] = useState<string>();
  const [totalItems, setTotalItems] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [files, setFiles] = useState<Record<number, File>>({}); //files to upload
  const [fileObjects, setFileObjects] = useState<Record<number, FileData>>({}); // all files from manifest file

  // populate the fileObjects with the files from the manifest file and the header
  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setName(dataStream.name);
        setCreator(dataStream.creator);
        setCreatedOn(dataStream.created_on);
        setModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        setTotalItems(dataStream.marshalManifest.totalItems);
        setNextIndex(dataStream.marshalManifest.totalItems + 1);
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
        toast.error("Error parsing manifest file. Invalid format manifest file fetched : " + (err instanceof Error) ? err.message : "", {
          icon: (
            <button onClick={() => toast.dismiss()}>
              <XCircle color="red" />
            </button>
          ),
        });
      }
    }
  }, [manifestFile]);

  function addNewFile(file: File) {
    setFiles((prevFiles) => {
      return {
        ...prevFiles,
        [nextIndex]: file,
      };
    });
    setFileObjects((prevFileObjects) => {
      const updatedFileObjects = { ...prevFileObjects };
      updatedFileObjects[nextIndex] = {
        idx: nextIndex,
        name: file.name,
        file: file.name,
        date: new Date().toISOString(),
        mime_type: file.type,
        size: file.size,
      };
      return updatedFileObjects;
    });
    setTotalItems((prev) => prev + 1);
    setNextIndex((prev) => prev + 1);
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
    setProgressBar(27);
    try {
      Object.values(files).forEach((file) => {
        filesToUpload.append("files", file, generateRandomString() + "_" + file.name);
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
    filesToUpload.append("category", CATEGORIES[currentCategory]); /// anyfile
    const response = await uploadFilesRequest(filesToUpload, theToken || "");

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
            matchingObj = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName.includes(fileToUpload.name));
            if (!matchingObj) throw new Error("The data has not been uploaded correctly. CID could not be found for file - " + fileToUpload.name);
          }
          return {
            idx: index + 1,
            name: matchingObj ? matchingObj.fileName : fileObj?.name,
            file: matchingObj ? `${IPFS_GATEWAY}ipfs/${matchingObj.folderHash}/${matchingObj.fileName}` : fileObj.file,
            date: fileObj.date ? new Date(fileObj.date).toISOString() : new Date().toISOString(),
            //category: file?.category,
            mime_type: fileObj?.mime_type,
            size: fileObj?.size,
          };
        }
      });
      return transformedData.filter((file: any) => file !== null);
    } catch (error: any) {
      toast.error("Error transforming the data: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
      console.error("ERROR transforming the data: ", error);
    }
  }

  const generateManifestFile = async () => {
    setProgressBar(12);
    try {
      const data = await transformFilesToDataArray();
      if (data === undefined) {
        return;
      }

      const manifest = {
        "data_stream": {
          "category": CATEGORIES[currentCategory],
          "name": name,
          "creator": creator,
          "created_on": createdOn,
          "last_modified_on": new Date().toISOString().split("T")[0],
          "marshalManifest": {
            "totalItems": totalItems,
            "nestedStream": "true",
          },
        },
        "data": data,
      };
      const formDataFormat = new FormData();
      formDataFormat.append(
        "files",
        new Blob([JSON.stringify(manifest)], { type: "application/json" }),
        manifestFileName ? manifestFileName : CATEGORIES[currentCategory] + "-manifest" + generateRandomString() + "_" + name + ".json"
      );
      formDataFormat.append("category", CATEGORIES[currentCategory]);
      const response = await uploadFilesRequest(formDataFormat, theToken || "");
      if (response[0]) {
        const ipfs: any = "ipfs/" + response[0]?.folderHash + "/" + response[0]?.fileName;
        setManifestFileIpfsUrl(ipfs);
        setManifestCid(response[0]?.hash);
        setFolderHash(response[0]?.folderHash);
        setRecentlyUploadedManifestFileName(response[0]?.fileName);
        toast.success("Manifest file uploaded successfully", {
          icon: (
            <button onClick={() => toast.dismiss()}>
              <Lightbulb color="yellow" />
            </button>
          ),
        });
      } else {
        throw new Error("The manifest file has not been uploaded correctly ");
      }
    } catch (error: any) {
      toast.error("Error generating the manifest file: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
      console.error("Error generating the manifest file:", error);
    }
    setProgressBar(100);
  };

  function checkIsDisabled() {
    if (!name || !creator || !createdOn || totalItems === 0) {
      return true;
    }
    return false;
  }

  return (
    <div className="flex  flex-col  h-full pb-16 ">
      <UploadHeader
        title={manifestFileIpfsUrl ? "Update" : "Upload" + " Data"}
        name={name}
        creator={creator}
        createdOn={createdOn}
        modifiedOn={modifiedOn}
        setName={setName}
        setCreator={setCreator}
        setCreatedOn={setCreatedOn}
        folderCid={folderCid}
        manifestFileName={manifestFileName}
        currentManifestFileCID={currentManifestFileCID}
      />
      <DragAndDropImageFiles setFile={addNewFile} className="w-full" />
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
          uploadFileToIpfs={generateManifestFile}
          isUploadButtonDisabled={checkIsDisabled()}
          progressBar={progressBar}
          manifestCid={manifestCid}
          folderHash={folderHash}
          recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
        />
      </div>
    </div>
  );
};
export default UploadAnyFiles;
