import React, { useEffect, useState } from "react";
import { TrailblazerNftForm } from "./components/TrailblazerNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "@libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { AssetCategories, FILES_CATEGORY, IPFS_GATEWAY } from "@utils/constants";
import { toast } from "sonner";
import { generateRandomString, uploadFilesRequest, onlyAlphaNumericChars } from "@utils/functions";
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [sizeToUpload, setSizeToUpload] = useState(0);

  const [manifestCid, setManifestCid] = useState<string>();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState<string>();
  const [folderHash, setFolderHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [ipnsHash, setIpnsHash] = useState<string>();
  const [modificationMadeInHeader, setModificationMadeInHeader] = useState<boolean>(false);
  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        setNumberOfItems(manifestFile.data_stream.marshalManifest.totalItems + 1);
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
    if (Object.keys(itemsData).length === 0) {
      toast.warning("There are no songs to upload. Please add at least one song to upload.");
    }

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
      toast.warning("There are errors in the form. Please fill all the fields correctly.");
      return false;
    }

    if (manifestFile && !checkIfModificationHasBeenMade()) {
      toast.warning("No modification was made");
      return false;
    }
    return true;
  }

  const checkIfModificationHasBeenMade = (): boolean => {
    // check in header values
    if (modificationMadeInHeader) {
      return true;
    }
    // check if files were uploaded
    if (Object.keys(filePairs).length > 0) {
      return true;
    }

    // check if the items data has been modified
    for (let idx = 0; idx < Object.keys(itemsData).length; idx++) {
      if (!isItemDataObjectEqual(itemsData[idx + 1], manifestFile.data[idx])) {
        return true;
      }
    }

    return false;
  };

  const isItemDataObjectEqual = (songData1: ItemData, songData2: ItemData) => {
    return (
      songData1.title === songData2.title &&
      songData1.link === songData2.link &&
      songData1.category === songData2.category &&
      songData1.date.split("T")[0] === songData2.date.split("T")[0]
    );
  };

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
              filePairs[idx + 1].image as Blob,
              generateRandomString() +
                (idx + 1) +
                "." +
                "image" +
                "_" +
                onlyAlphaNumericChars(mediaData.title) +
                "." +
                (filePairs[idx + 1].image?.name.split(".")[1] ?? "")
            );
          }

          if (filePairs[idx + 1]?.media) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].media as Blob,
              generateRandomString() +
                (idx + 1) +
                "." +
                "media" +
                "_" +
                onlyAlphaNumericChars(mediaData.title) +
                "." +
                filePairs[idx + 1].media?.name.split(".")[1]
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
  };
  function deleteItem(index: number) {
    const variableItemsData = { ...itemsData };
    const variableFilePairs = { ...filePairs };
    const variableValidationErrors = { ...validationErrors };

    if (variableFilePairs[index]) {
      let sizeToRemove = 0;
      if (variableFilePairs[index].media) sizeToRemove += variableFilePairs[index]?.media.size;
      if (variableFilePairs[index].image) sizeToRemove += variableFilePairs[index]?.image.size;
      setSizeToUpload((prev) => prev - sizeToRemove);
    }
    for (let i = index; i < numberOfItems - 1; ++i) {
      variableItemsData[i] = variableItemsData[i + 1];
      variableFilePairs[i] = variableFilePairs[i + 1];
      variableValidationErrors[i] = variableValidationErrors[i + 1];
    }

    delete variableItemsData[numberOfItems - 1];
    delete variableFilePairs[numberOfItems - 1];
    delete variableValidationErrors[numberOfItems - 1];

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
    let _sizeToUpload = 0;
    if (image && media) {
      // Both image and media files uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { image: image, media: media },
      }));
      if (filePairs[index]?.image) _sizeToUpload -= filePairs[index]?.image.size;
      if (filePairs[index]?.media) _sizeToUpload -= filePairs[index]?.media.size;
      _sizeToUpload += image.size + media.size;
    } else if (image) {
      // Only image file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], image: image },
      }));
      if (filePairs[index]?.image) _sizeToUpload -= filePairs[index]?.image.size;
      _sizeToUpload += image.size;
    } else if (media) {
      // Only media file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], media: media },
      }));
      if (filePairs[index]?.media) _sizeToUpload -= filePairs[index]?.media.size;
      _sizeToUpload += media.size;
    }
    setSizeToUpload((prev) => prev + _sizeToUpload);
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

    if (message === "") return true;
    else return false;
  };

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl">
          <UploadHeader
            title={(manifestFile ? "Update" : "Upload") + " Trailblazer Data"}
            folderCid={folderCid}
            manifestFileName={manifestFileName}
            currentManifestFileCID={currentManifestFileCID}
            ipnsHash={ipnsHash}
            dataStream={manifestFile?.data_stream}
            setModificationMadeInHeader={setModificationMadeInHeader}
          />
          <div className="flex flex-row  text-accent pt-4">
            <div>Files to upload: {(sizeToUpload / (1024 * 1024)).toFixed(2)} MB </div>
          </div>
          <DataObjectsList
            DataObjectsComponents={Object.keys(itemsData).map((index: any) => (
              <TrailblazerNftForm
                key={index}
                index={index}
                lastItem={Number(index) === numberOfItems - 1}
                itemData={itemsData[index]}
                setterFunction={handleFilesSelected}
                swapFunction={swapItemData}
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
            category={AssetCategories.TRALBLAZER}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
