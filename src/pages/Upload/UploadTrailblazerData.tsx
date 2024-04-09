import React, { useEffect, useState } from "react";
import { TrailblazerNftForm } from "./components/TrailblazerNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "@libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { FILES_CATEGORY, IPFS_GATEWAY } from "@utils/constants";
import { Lightbulb, XCircle } from "lucide-react";
import { toast } from "sonner";
import { generateRandomString, uploadFilesRequest, onlyAlphaNumericChars, publishIpns } from "@utils/functions";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "@components/ErrorComponents/ErrorFallbackMusicDataNfts";
import UploadHeader from "./components/UploadHeader";
import DataObjectsList from "./components/DataObjectsList";

type ItemData = {
  date: string;
  category: string;
  title: string;
  link: string;
  file?: string;
  file_preview_img?: string;
  file_mimeType?: string;
};

type FilePair = {
  image?: File;
  media?: File;
};

export const UploadTrailblazerData = () => {
  const location = useLocation();
  const { manifestFile, decentralized } = location.state || {};
  const manifestFileName = manifestFile?.manifestFileName;
  const folderCid = manifestFile?.folderHash;
  const currentManifestFileCID = manifestFile?.hash;

  const [itemsData, setItemsData] = useState<Record<number, ItemData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [stream, setStream] = useState(true);
  const [manifestCid, setManifestCid] = useState<string>();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState<string>();
  const [folderHash, setFolderHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [ipnsHash, setIpnsHash] = useState<string>();

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setName(dataStream.name);
        setCreator(dataStream.creator);
        setCreatedOn(dataStream.created_on);
        setModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        setNumberOfItems(dataStream.marshalManifest.totalItems + 1);
        setStream(dataStream.marshalManifest.nestedStream);
        setIpnsHash(manifestFile.ipnsHash);
        setRecentlyUploadedManifestFileName(manifestFile.manifestFileName);

        const itemDataMap = manifestFile.data.reduce(
          (acc: any, itemData: any) => {
            if (itemData) acc[itemData.idx] = itemData;
            return acc;
          },
          {} as Record<number, ItemData>
        );
        setItemsData(itemDataMap);
      } catch (err: any) {
        setErrorMessage("Error parsing manifest file : " + (err instanceof Error) ? err.message : "");
        console.error("ERROR parsing manifest file : ", err);
        toast.error("Error parsing manifest file. Invalid format manifest file fetched : " + (err instanceof Error) ? err.message : "");
      }
    }
  }, [manifestFile]);

  function validateItemsData() {
    let isValid = true;
    if (itemsData) {
      Object.keys(itemsData).forEach((key: string) => {
        isValid = dataAssetObjectValidation(Number(key)) && isValid;
      });
    } else {
      isValid = false;
    }
    return isValid;
  }

  function validateUpload() {
    if (!validateItemsData()) {
      return false;
    }

    if (unsavedChanges && Object.values(unsavedChanges).length == 0) {
      toast.warning("No modification was made");
      return false;
    }
    return true;
  }

  // upload the preview images and media of all the items
  async function uploadItemItemMediaFiles() {
    const filesToUpload = new FormData();
    try {
      //iterating over the itemsData and for each object add its preview image and media to the formData
      Object.values(itemsData).forEach((mediaData, idx) => {
        if (mediaData && mediaData?.title && filePairs[idx + 1]) {
          if (filePairs[idx + 1]?.image) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].image,
              generateRandomString() +
                (idx + 1) +
                "." +
                "image" +
                "_" +
                onlyAlphaNumericChars(mediaData.title) +
                "." +
                filePairs[idx + 1].image.name.split(".")[1]
            );
          }

          if (filePairs[idx + 1]?.media) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].media,
              generateRandomString() +
                (idx + 1) +
                "." +
                "media" +
                "_" +
                onlyAlphaNumericChars(mediaData.title) +
                "." +
                filePairs[idx + 1].media.name.split(".")[1]
            );
          }
        }
      });
    } catch (error: any) {
      setErrorMessage("Error iterating through items Data : " + (error instanceof Error) ? error.message : "");
      console.error("ERROR iterating through items Data : ", error);
      toast.error(
        "Error iterating through items Data : " +
          `${error ? error.message + ". " + error?.response?.data.message : ""}` +
          " Please check all the fields to be filled correctly."
      );
    }

    filesToUpload.append("category", FILES_CATEGORY); // set the category for files to file

    if (filesToUpload.getAll("files").length === 0) return [];

    const response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "");
    if (response.response && response.response.data.statusCode === 402) {
      setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue");
      return undefined;
    }
    return response;
  }

  /**
   * Get all items data into the right format for manifest file
   * Transforms the items data and uploads the preview images and media files.
   * @returns {Array<Object>} The transformed data of the items.
   * @throws {Error} If the upload items import.meta did not work correctly or if the data has not been uploaded correctly.
   */
  async function transformItemData() {
    try {
      const responseDataCIDs = await uploadItemItemMediaFiles();
      if (!responseDataCIDs) return;

      // Iterate through the response list and find the matching cidv1
      const transformedData = Object.values(itemsData).map((itemObj, index) => {
        if (itemObj && itemObj?.title) {
          let matchingObjImage;
          let matchingObjItem;
          const fileObj = filePairs[index + 1];
          if (fileObj) {
            if (fileObj.image && fileObj.image.name) {
              matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) =>
                uploadedFileObj.fileName.includes(`${index + 1}.image_${onlyAlphaNumericChars(itemObj.title)}`)
              );
              if (!matchingObjImage) throw new Error("The data has not been uploaded correctly. Preview Image CID could not be found ");
            }
            if (fileObj.media && fileObj.media.name) {
              matchingObjItem = responseDataCIDs.find((uploadedFileObj: any) =>
                uploadedFileObj.fileName.includes(`${index + 1}.media_${onlyAlphaNumericChars(itemObj.title)}`)
              );
              if (!matchingObjItem) throw new Error("The data has not been uploaded correctly. Media CID could not be found ");
            }
          }
          const condensedObject: any = {
            idx: index + 1,
            date: new Date(itemObj?.date).toISOString(),
            category: itemObj?.category,
            title: itemObj?.title,
            link: itemObj?.link,
          };

          // we don't need to save file, file_mimeType or file_preview_img if it does not exist
          if (itemObj.file || matchingObjItem) {
            condensedObject["file"] = matchingObjItem ? `${IPFS_GATEWAY}ipfs/${matchingObjItem.folderHash}/${matchingObjItem.fileName}` : itemObj.file;
          }

          if (itemObj?.file_mimeType) {
            condensedObject["file_mimeType"] = itemObj?.file_mimeType;
          }

          if (itemObj.file_preview_img || matchingObjImage) {
            condensedObject["file_preview_img"] = matchingObjImage
              ? `${IPFS_GATEWAY}ipfs/${matchingObjImage.folderHash}/${matchingObjImage.fileName}`
              : itemObj.file_preview_img;
          }

          return condensedObject;
        }
      });
      return transformedData.filter((item: any) => item !== null);
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
  const handleAddMoreItems = () => {
    setItemsData((prev) => Object.assign(prev, { [numberOfItems]: {} }));
    setNumberOfItems((prev) => prev + 1);
    setUnsavedChanges((prev) => ({ ...prev, [numberOfItems]: true }));
  };
  function deleteItem(index: number) {
    const variableItemsData = { ...itemsData };
    const variableFilePairs = { ...filePairs };
    const variableUnsavedChanges = { ...unsavedChanges };
    const variableValidationErrors = { ...validationErrors };

    for (let i = index; i < numberOfItems - 1; ++i) {
      variableItemsData[i] = variableItemsData[i + 1];
      variableFilePairs[i] = variableFilePairs[i + 1];
      variableUnsavedChanges[i] = variableUnsavedChanges[i + 1];
      variableValidationErrors[i] = variableValidationErrors[i + 1];
    }

    delete variableItemsData[numberOfItems - 1];
    delete variableFilePairs[numberOfItems - 1];
    delete variableUnsavedChanges[numberOfItems - 1];
    delete variableValidationErrors[numberOfItems - 1];

    setUnsavedChanges(variableUnsavedChanges);
    setItemsData(variableItemsData);
    setFilePairs(variableFilePairs);
    setValidationErrors(variableValidationErrors);
    setNumberOfItems((prev) => prev - 1);
  }

  /**
   * Swaps the items at the given indices in the itemsData and filePairs state.
   * If second is -1, it deletes the item at index first.
   * @param first - The index of the first item to swap or delete.
   * @param second - The index of the second item to swap. Use -1 to delete the item at index first.
   */
  function swapItemData(first: number, second: number) {
    if (first < 1 || second >= numberOfItems) {
      return;
    }

    if (first < numberOfItems - 1 || second !== -1) {
      if (validateItemsData() === false) {
        toast.error(`Please fill all fields before ${second == -1 ? "deleting" : "swapping the"} songs`);
        return;
      }
    }

    // deleting item with index = first
    if (second === -1) {
      deleteItem(first);
      return;
    }
    const itemsDataVar = { ...itemsData };
    const storeItem = itemsDataVar[second];
    itemsDataVar[second] = itemsDataVar[first];
    itemsDataVar[first] = storeItem;

    const storeFilesVar = { ...filePairs };
    const storeFile = storeFilesVar[second];
    storeFilesVar[second] = storeFilesVar[first];
    storeFilesVar[first] = storeFile;

    setItemsData(itemsDataVar);
    setFilePairs(storeFilesVar);
  }
  // setter function for a music Data nft form fields and files
  const handleFilesSelected = (index: number, formInputs: any, image: File, media: File) => {
    if (image && media) {
      // Both image and media files uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { image: image, media: media },
      }));
    } else if (image) {
      // Only image file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], image: image },
      }));
    } else if (media) {
      // Only media file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], media: media },
      }));
    }
    setItemsData((prev) => Object.assign({}, prev, { [index]: formInputs }));
    if (validationErrors[index] && validationErrors[index] !== "") {
      dataAssetObjectValidation(index);
    }
  };
  const dataAssetObjectValidation = (index: number) => {
    let message: string = "";
    if (itemsData[index]) {
      if (!itemsData[index].title) {
        message += "Title, ";
      }
      if (!itemsData[index].category) {
        message += "Category, ";
      }
      if (!itemsData[index].link) {
        message += "Link, ";
      }
      if (!itemsData[index].date) {
        message += "Date, ";
      }
      if (!filePairs[index]?.image && !itemsData[index].file_preview_img && !filePairs[index]?.media && !itemsData[index].file) {
        message += "Either Media Image OR Media File is mandatory. Both allowed as well. ";
      }
    }
    setValidationErrors((prev) => ({ ...prev, [index]: message.slice(0, -2) }));
    if (message === "") {
      setUnsavedChanges((prev) => ({ ...prev, [index]: false }));
      return true;
    } else {
      setUnsavedChanges((prev) => ({ ...prev, [index]: true }));
      return false;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl">
          <UploadHeader
            title={(manifestFile ? "Update" : "Upload") + " Trailblazer Data"}
            name={name}
            creator={creator}
            createdOn={createdOn}
            modifiedOn={modifiedOn}
            setName={setName}
            stream={stream}
            setStream={setStream}
            setCreator={setCreator}
            setCreatedOn={setCreatedOn}
            folderCid={folderCid}
            manifestFileName={manifestFileName}
            currentManifestFileCID={currentManifestFileCID}
            ipnsHash={ipnsHash}
          />
          <DataObjectsList
            DataObjectsComponents={Object.keys(itemsData).map((index: any) => (
              <TrailblazerNftForm
                key={index}
                index={index}
                lastItem={Number(index) === numberOfItems - 1}
                itemData={itemsData[index]}
                setterFunction={handleFilesSelected}
                swapFunction={swapItemData}
                unsavedChanges={unsavedChanges[index]}
                setUnsavedChanges={(index: number, value: boolean) => setUnsavedChanges({ ...unsavedChanges, [index]: value })}
                validationMessage={validationErrors[index]}
              />
            ))}
            addButton={
              <div className="flex flex-col justify-center items-center">
                <Button
                  className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}
                  onClick={handleAddMoreItems}>
                  Add Item
                </Button>
              </div>
            }
            transformFilesToDataArray={transformItemData}
            setResponsesOnSuccess={setResponsesOnSuccess}
            validateDataObjects={validateUpload}
            manifestCid={manifestCid}
            folderHash={folderHash}
            recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
            ipnsHash={ipnsHash}
            ipnsKey={manifestFile?.ipnsKey}
            errorMessage={errorMessage}
            storageType={decentralized}
            headerValues={{
              name: name,
              creator: creator,
              createdOn: createdOn,
              stream: stream,
              category: 2, // trailblazer
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
