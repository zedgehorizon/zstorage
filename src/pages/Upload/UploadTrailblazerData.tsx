import React, { useEffect, useState } from "react";
import { TrailblazerNftForm } from "./components/TrailblazerNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { CATEGORIES, FILES_CATEGORY, IPFS_GATEWAY } from "../../utils/constants";
import { Lightbulb, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { generateRandomString, publishIpns, uploadFilesRequest } from "../../utils/utils";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "../../components/ErrorComponents/ErrorFallbackMusicDataNfts";
import UploadHeader from "./components/UploadHeader";
import DataObjectsList from "./components/DataObjectsList";

// {
//   "category": "Feature",
//   "date": "2022-10-06T00:00:00Z",
//   "title": "Morningstar Ventures Project Review",
//   "link": "https://twitter.com/Morningstar_vc/status/1577801459013386240"
// }

// {
//   "category": "Meme",
//   "date": "2024-02-01T05:37:17Z",
//   "title": "Feb 1 2024 Announcement Secret Team Meeting",
//   "link": "https://twitter.com/PepeVersX/status/1752353118208098615",
//   "file": "https://gateway.lighthouse.storage/ipfs/QmUaTKTpgSdU12v7ERqVN7vLtMuofaGDapYCnfhTnHiEvG/meme_video_feb_1_2024_meeting.mp4",
//   "file_preview_img": "https://gateway.lighthouse.storage/ipfs/QmUaTKTpgSdU12v7ERqVN7vLtMuofaGDapYCnfhTnHiEvG/meme_previmg_feb_1_2024_meeting.png",
//   "file_mimeType": "video/mp4"
// }

type ItemData = {
  date: string;
  category: string;
  title: string;
  link: string;
  file: string;
  file_preview_img: string;
  file_mimeType: string;
};

type FilePair = {
  image: File;
  media: File;
};

export const UploadTrailblazerData: React.FC = () => {
  const location = useLocation();
  const currentCategory = 2; // trailblazer
  const { currentManifestFileCID, manifestFile, action, type, template, storage, decentralized, manifestFileName, folderCid } = location.state || {};
  const [itemsData, setItemsData] = useState<Record<number, ItemData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<boolean[]>([]);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const theToken = tokenLogin?.nativeAuthToken;
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(true);
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);
  const [manifestCid, setManifestCid] = useState();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState();
  const [folderHash, setFolderHash] = useState();
  const [ipnsHash, setIpnsHash] = useState();

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setName(dataStream.name);
        setCreator(dataStream.creator);
        setCreatedOn(dataStream.created_on);
        setModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        setNumberOfItems(dataStream.marshalManifest.totalItems + 1);
        const itemDataMap = manifestFile.data.reduce(
          (acc: any, itemData: any) => {
            if (itemData) acc[itemData.idx] = itemData;
            return acc;
          },
          {} as Record<number, ItemData>
        );
        setItemsData(itemDataMap);
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

  // check whether the upload button should be disabled or not
  useEffect(() => {
    let hasUnsavedChanges = false;

    if (numberOfItems > 1 && itemsData[1].title) {
      if (Object.keys(unsavedChanges).length === 0) hasUnsavedChanges = true;
      Object.values(unsavedChanges).forEach((item) => {
        if (item === true) {
          hasUnsavedChanges = true;
        }
      });
    } else {
      hasUnsavedChanges = true;
    }
    hasUnsavedChanges = hasUnsavedChanges || !verifyHeaderFields();
    setIsUploadButtonDisabled(hasUnsavedChanges);
  }, [itemsData, unsavedChanges, name, creator, createdOn]);

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
              generateRandomString() + "." + "image" + "_" + mediaData.title + "." + filePairs[idx + 1].image.name.split(".")[1]
            );
          }
          if (filePairs[idx + 1]?.media) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].media,
              generateRandomString() + "." + "media" + "_" + mediaData.title + "." + filePairs[idx + 1].media.name.split(".")[1]
            );
          }
        }
      });
    } catch (error: any) {
      console.error("ERROR iterating through items Data : ", error);
      toast.error(
        "Error iterating through items Data : " +
          `${error ? error.message + ". " + error?.response?.data.message : ""}` +
          " Please check all the fields to be filled correctly.",
        {
          icon: (
            <button onClick={() => toast.dismiss()}>
              <XCircle color="red" />
            </button>
          ),
        }
      );
    }

    filesToUpload.append("category", FILES_CATEGORY); // set the category for files to file

    if (filesToUpload.getAll("files").length === 0) return [];

    const response = await uploadFilesRequest(filesToUpload, theToken || "");
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
      if (progressBar < 60) setProgressBar(60);
      if (!responseDataCIDs) return;
      // Iterate through the response list and find the matching cidv1
      const transformedData = Object.values(itemsData).map((itemObj, index) => {
        if (itemObj && itemObj?.title) {
          let matchingObjImage;
          let matchingObjItem;
          const fileObj = filePairs[index + 1];
          if (fileObj) {
            if (fileObj.image && fileObj.image.name) {
              matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName.includes(`.image_${itemObj.title}`));
              if (!matchingObjImage) throw new Error("The data has not been uploaded correctly. Preview Image CID could not be found ");
            }
            if (fileObj.media && fileObj.media.name) {
              matchingObjItem = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName.includes(`.media_${itemObj.title}`));
              if (!matchingObjItem) throw new Error("The data has not been uploaded correctly. Media CID could not be found ");
            }
          }

          return {
            idx: index + 1,
            date: new Date(itemObj?.date).toISOString(),
            category: itemObj?.category,
            title: itemObj?.title,
            link: itemObj?.link,
            file: matchingObjItem ? `${IPFS_GATEWAY}ipfs/${matchingObjItem.folderHash}/${matchingObjItem.fileName}` : itemObj.file,
            file_preview_img: matchingObjImage ? `${IPFS_GATEWAY}ipfs/${matchingObjImage.folderHash}/${matchingObjImage.fileName}` : itemObj.file_preview_img,
            file_mimeType: itemObj?.file_mimeType,
          };
        }
      });
      return transformedData.filter((item: any) => item !== null);
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

  function verifyHeaderFields() {
    if (!name || !creator || !createdOn || !itemsData) {
      // toast.error("Please fill all the fields from the header section", {
      //   icon: (
      //     <button onClick={() => toast.dismiss()}>
      //       <Lightbulb color="yellow" />
      //     </button>
      //   ),
      // });
      return false;
    }
    return true;
  }

  /**
   * Generates a manifest file based on the form data and uploads it to the server.
   * If any required fields are missing, an error toast is displayed.

   * The manifest file is uploaded to the server using a multipart/form-data request.
   * The response contains the CID (Content Identifier) of the uploaded manifest file.
   * If the upload is successful, the CID is set as the manifestCid state.
   * @throws {Error} If there is an error transforming the data or if the manifest file is not uploaded correctly.
   */
  const generateManifestFile = async () => {
    setProgressBar(12);
    if (!verifyHeaderFields()) {
      return;
    }

    try {
      const data = await transformItemData();
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
            "totalItems": numberOfItems - 1,
            "nestedStream": "true", // set to true for MUSIC DATA NFTs
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

        if (decentralized.includes("IPNS")) {
          const ipnsResponse = await publishIpns(theToken || "", response[0]?.hash, manifestFile?.ipnsKey);

          if (ipnsResponse) {
            setIpnsHash(ipnsResponse.hash);
            toast.success("IPNS published successfully", {
              icon: (
                <button onClick={() => toast.dismiss()}>
                  <Lightbulb color="yellow" />
                </button>
              ),
            });
          }
        }
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

  const handleAddMoreItems = () => {
    setItemsData((prev) => Object.assign(prev, { [numberOfItems]: {} }));
    setNumberOfItems((prev) => prev + 1);
    setUnsavedChanges((prev) => ({ ...prev, [numberOfItems]: true }));
  };

  function deleteItem(index: number) {
    const variableItemsData = { ...itemsData };
    const variableFilePairs = { ...filePairs };
    const variableUnsavedChanges = { ...unsavedChanges };

    for (let i = index; i < numberOfItems - 1; ++i) {
      variableItemsData[i] = variableItemsData[i + 1];
      variableFilePairs[i] = variableFilePairs[i + 1];
      variableUnsavedChanges[i] = variableUnsavedChanges[i + 1];
    }

    delete variableItemsData[numberOfItems - 1];
    delete variableFilePairs[numberOfItems - 1];
    delete variableUnsavedChanges[numberOfItems - 1];

    setUnsavedChanges(variableUnsavedChanges);
    setItemsData(variableItemsData);
    setFilePairs(variableFilePairs);
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

    // deleting item with index = first
    if (second === -1) {
      deleteItem(first);
      return;
    }

    if (unsavedChanges[first] || unsavedChanges[second]) {
      toast.error("Please save all the changes before swapping the items", {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <Lightbulb color="yellow" />
          </button>
        ),
      });
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
  };

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl  ">
          <UploadHeader
            title={(manifestFile ? "Update" : "Upload") + " Trailblazer Data"}
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
                setUnsavedChanges={(index: number, value: boolean) => setUnsavedChanges({ ...unsavedChanges, [index]: value })}></TrailblazerNftForm>
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
            isUploadButtonDisabled={isUploadButtonDisabled}
            progressBar={progressBar}
            uploadFileToIpfs={generateManifestFile}
            manifestCid={manifestCid}
            recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
            folderHash={folderHash}
            ipnsHash={ipnsHash}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
