import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "./components/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "@libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { CATEGORIES, FILES_CATEGORY, IPFS_GATEWAY } from "@utils/constants";
import { Lightbulb, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { generateRandomString, uploadFilesRequest, onlyAlphaNumericChars, publishIpns } from "@utils/functions";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "@components/ErrorComponents/ErrorFallbackMusicDataNfts";
import UploadHeader from "./components/UploadHeader";
import DataObjectsList from "./components/DataObjectsList";
import { Modal } from "@components/Modal";
import { AudioPlayerPreview } from "@components/AudioPlayerPreview";
import MintDataNftModal from "./components/modals/MintDataNftModal";

type SongData = {
  date: string;
  category: string;
  artist: string;
  album: string;
  title: string;
  file: string;
  cover_art_url: string;
};

type FilePair = {
  image: File;
  audio: File;
};

export const UploadMusicData: React.FC = () => {
  const currentCategory = 1; // musicplaylist
  const location = useLocation();
  const { manifestFile, decentralized } = location.state || {};
  const manifestFileName = manifestFile?.manifestFileName;
  const folderCid = manifestFile?.folderHash;
  const currentManifestFileCID = manifestFile?.hash;

  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState(new Date().toISOString().split("T")[0]);
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);
  const [manifestCid, setManifestCid] = useState();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState();
  const [folderHash, setFolderHash] = useState();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [ipnsHash, setIpnsHash] = useState();

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setName(dataStream.name);
        setCreator(dataStream.creator);
        setCreatedOn(dataStream.created_on);
        setModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        setNumberOfSongs(dataStream.marshalManifest.totalItems + 1);
        setIpnsHash(manifestFile.ipnsHash);

        const songsDataMap = manifestFile.data.reduce(
          (acc: any, song: any) => {
            if (song) acc[song.idx] = song;
            return acc;
          },
          {} as Record<number, SongData>
        );
        setSongsData(songsDataMap);
      } catch (err: any) {
        setErrorMessage("Error parsing manifest file : " + (err instanceof Error) ? err.message : "");
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

    if (numberOfSongs > 1 && songsData[1].title) {
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
  }, [songsData, unsavedChanges, name, creator, createdOn]);

  function validateData() {
    console.log(songsData, "songsData");
    console.log("validation ERRROrS", validationErrors);
    if (songsData) {
      Object.keys(songsData).forEach((index: any) => {
        dataAssetObjectValidation(Number(index));
      });
    }
  }

  // upload the audio and images of all the songs
  async function uploadSongsAndImagesFiles() {
    const filesToUpload = new FormData();
    try {
      //iterating over the songsData and for each object add its image and song to the formData
      Object.values(songsData).forEach((songData, idx) => {
        if (songData && songData?.title && filePairs[idx + 1]) {
          if (filePairs[idx + 1]?.image) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].image,
              generateRandomString() +
                (idx + 1) +
                "." +
                "image" +
                "_" +
                onlyAlphaNumericChars(songData.title) +
                "." +
                filePairs[idx + 1].image.name.split(".")[1]
            );
          }
          if (filePairs[idx + 1]?.audio) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].audio,
              generateRandomString() +
                (idx + 1) +
                "." +
                "audio" +
                "_" +
                onlyAlphaNumericChars(songData.title) +
                "." +
                filePairs[idx + 1].audio.name.split(".")[1]
            );
          }
        }
      });
    } catch (error: any) {
      setErrorMessage("Error iterating through songs Data : " + (error instanceof Error) ? error.message : "");
      console.error("ERROR iterating through songs Data : ", error);
      toast.error(
        "Error iterating through songs Data : " +
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

    const response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "");
    if (response.response && response.response.data.statusCode === 402) {
      setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue");
      return undefined;
    }
    return response;
  }

  /**
   * Get all songs data into the right format for manifest file
   * Transforms the songs data and uploads the songs and images files.
   * @returns {Array<Object>} The transformed data of the songs.
   * @throws {Error} If the upload songs import.meta did not work correctly or if the data has not been uploaded correctly.
   */
  async function transformSongsData() {
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      if (!responseDataCIDs) return;
      // Iterate through the response list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        if (songObj && songObj?.title) {
          let matchingObjImage;
          let matchingObjSong;
          const fileObj = filePairs[index + 1];
          if (fileObj) {
            if (fileObj.image && fileObj.image.name) {
              matchingObjImage = responseDataCIDs.find(
                (uploadedFileObj: any) => uploadedFileObj.fileName.includes(`${index + 1}.image_${onlyAlphaNumericChars(songObj.title)}`) // have to do the filtering because the responseDataCids does not come in the same order as uploaded
              );
              if (!matchingObjImage) throw new Error("The data has not been uploaded correctly. Image CID could not be found ");
            }
            if (fileObj.audio && fileObj.audio.name) {
              matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) =>
                uploadedFileObj.fileName.includes(`${index + 1}.audio_${onlyAlphaNumericChars(songObj.title)}`)
              );
              if (!matchingObjSong) throw new Error("The data has not been uploaded correctly. Song CID could not be found ");
            }
          }

          return {
            idx: index + 1,
            date: new Date(songObj?.date).toISOString(),
            category: songObj?.category,
            artist: songObj?.artist,
            album: songObj?.album,
            file: matchingObjSong ? `${IPFS_GATEWAY}ipfs/${matchingObjSong.folderHash}/${matchingObjSong.fileName}` : songObj.file,
            cover_art_url: matchingObjImage ? `${IPFS_GATEWAY}ipfs/${matchingObjImage.folderHash}/${matchingObjImage.fileName}` : songObj.cover_art_url,
            title: songObj?.title,
          };
        }
      });
      return transformedData.filter((song: any) => song !== null);
    } catch (error: any) {
      setErrorMessage("Error transforming the data : " + (error instanceof Error) ? error.message : "");
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
    if (!name || !creator || !createdOn || !songsData) {
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
    validateData();
    setProgressBar(12);

    if (!verifyHeaderFields()) {
      return;
    }

    try {
      const data = await transformSongsData();

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
            "totalItems": numberOfSongs - 1,
            "nestedStream": true, // set always true for MUSIC DATA NFTs
          },
        },
        "data": data,
      };

      const formDataFormat = new FormData();

      formDataFormat.append(
        "files",
        new Blob([JSON.stringify(manifest)], { type: "application/json" }),
        manifestFileName ? manifestFileName : CATEGORIES[currentCategory] + "-manifest" + generateRandomString() + "_" + onlyAlphaNumericChars(name) + ".json"
      );

      formDataFormat.append("category", CATEGORIES[currentCategory]);

      const response = await uploadFilesRequest(formDataFormat, tokenLogin?.nativeAuthToken || "");

      if (response.response && response.response.data.statusCode === 402) {
        setErrorMessage("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue");
        return undefined;
      }
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
        if ((decentralized && decentralized === "IPNS + IPFS") || manifestFile?.ipnsKey) {
          const ipnsResponse = await publishIpns(tokenLogin?.nativeAuthToken || "", response[0]?.hash, manifestFile?.ipnsKey);

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

        setProgressBar(100);
      } else {
        throw new Error("The manifest file has not been uploaded correctly ");
      }
    } catch (error: any) {
      setErrorMessage("Error generating the manifest file : " + (error instanceof Error) ? error.message : "");
      toast.error("Error generating the manifest file: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });

      console.error("Error generating the manifest file:", error);
    }
  };

  const handleAddMoreSongs = () => {
    setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
    setNumberOfSongs((prev) => prev + 1);
    setUnsavedChanges((prev) => ({ ...prev, [numberOfSongs]: true }));
  };

  function deleteSong(index: number) {
    const variableSongsData = { ...songsData };
    const variableFilePairs = { ...filePairs };
    const variableUnsavedChanges = { ...unsavedChanges };

    for (let i = index; i < numberOfSongs - 1; ++i) {
      variableSongsData[i] = variableSongsData[i + 1];
      variableFilePairs[i] = variableFilePairs[i + 1];
      variableUnsavedChanges[i] = variableUnsavedChanges[i + 1];
    }

    delete variableSongsData[numberOfSongs - 1];
    delete variableFilePairs[numberOfSongs - 1];
    delete variableUnsavedChanges[numberOfSongs - 1];

    setUnsavedChanges(variableUnsavedChanges);
    setSongsData(variableSongsData);
    setFilePairs(variableFilePairs);
    setNumberOfSongs((prev) => prev - 1);
  }

  /**
   * Swaps the songs at the given indices in the songsData and filePairs state.
   * If second is -1, it deletes the song at index first.
   * @param first - The index of the first song to swap or delete.
   * @param second - The index of the second song to swap. Use -1 to delete the song at index first.
   */
  function swapSongs(first: number, second: number) {
    if (first < 1 || second >= numberOfSongs) {
      return;
    }

    // deleting song with index = first
    if (second === -1) {
      deleteSong(first);
      return;
    }

    if (unsavedChanges[first] || unsavedChanges[second]) {
      toast.error("Please save all the changes before swapping the songs", {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <Lightbulb color="yellow" />
          </button>
        ),
      });
      return;
    }

    const songsDataVar = { ...songsData };
    const storeSong = songsDataVar[second];
    songsDataVar[second] = songsDataVar[first];
    songsDataVar[first] = storeSong;

    const storeFilesVar = { ...filePairs };
    const storeFile = storeFilesVar[second];
    storeFilesVar[second] = storeFilesVar[first];
    storeFilesVar[first] = storeFile;

    setSongsData(songsDataVar);
    setFilePairs(storeFilesVar);
  }

  // setter function for a music Data nft form fields and files
  const handleFilesSelected = (index: number, formInputs: any, image: File, audio: File) => {
    console.log("received info", index, formInputs, image, audio);
    if (image && audio) {
      // Both image and audio files uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { image: image, audio: audio },
      }));
    } else if (image) {
      // Only image file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], image: image },
      }));
    } else if (audio) {
      // Only audio file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], audio: audio },
      }));
    }
    setSongsData((prev) => Object.assign({}, prev, { [index]: formInputs }));
  };

  const dataAssetObjectValidation = (index: number) => {
    let message: string = "";
    if (songsData[index]) {
      if (!songsData[index].title) {
        message += "Title, ";
      }
      if (!songsData[index].artist) {
        message += "Artist, ";
      }
      if (!songsData[index].album) {
        message += "Album, ";
      }
      if (!songsData[index].category) {
        message += "Category, ";
      }
      if (!songsData[index].date) {
        message += "Date, ";
      }
      if (!filePairs[index]?.image && !songsData[index].cover_art_url) {
        message += "Image, ";
      }
      if (!filePairs[index]?.audio && !songsData[index].file) {
        message += "Audio, ";
      }
    }

    setValidationErrors((prev) => ({ ...prev, [index]: message }));
    if (message === "") {
      setUnsavedChanges((prev) => ({ ...prev, [index]: false }));
      return true;
    } else {
      setUnsavedChanges((prev) => ({ ...prev, [index]: true }));
      return false;
    }
  };

  const handleModalUploadButton = () => {
    document.getElementById("uploadButton")?.click();
  };

  const handleOpenMintModal = () => {
    document.getElementById("mintModalTrigger")?.click();
  };

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <div className="min-h-[100svh] flex flex-col items-center justify-start rounded-3xl  ">
          <UploadHeader
            title={(manifestFile ? "Update" : "Upload") + " Music Data"}
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
            ipnsHash={ipnsHash}
          />
          <DataObjectsList
            DataObjectsComponents={Object.keys(songsData).map((index: any) => (
              <MusicDataNftForm
                key={index}
                index={index}
                lastItem={Number(index) === numberOfSongs - 1}
                song={songsData[index]}
                setterFunction={handleFilesSelected}
                swapFunction={swapSongs}
                unsavedChanges={unsavedChanges[index]}
                validationMessage={validationErrors[index]}
                setUnsavedChanges={(index: number, value: boolean) => setUnsavedChanges({ ...unsavedChanges, [index]: value })}></MusicDataNftForm>
            ))}
            addButton={
              <div className="flex flex-row justify-center items-center gap-8">
                <Button
                  className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}
                  onClick={handleAddMoreSongs}>
                  Add song
                </Button>
                <Button className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"} onClick={validateData}>
                  Validate data
                </Button>
                <Modal
                  closeOnOverlayClick={true}
                  modalClassName="p-0 m-0 max-w-[80%] "
                  title="Preview Music Data NFTs"
                  titleClassName="px-8 mt-3"
                  footerContent={
                    <div className="flex flex-row   p-2 gap-8 justify-center items-center w-full -mt-16 ">
                      <p className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>Back to edit</p>
                      <p
                        className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}
                        onClick={handleModalUploadButton}>
                        Upload Data
                      </p>
                      <p
                        onClick={handleOpenMintModal}
                        className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}>
                        Mint Data NFT
                      </p>
                    </div>
                  }
                  openTrigger={
                    <Button
                      disabled={isUploadButtonDisabled}
                      className={"px-8 mt-8 border border-accent bg-background rounded-full hover:shadow  hover:shadow-accent"}>
                      Preview Player
                    </Button>
                  }>
                  <div className="flex flex-col h-[30rem] scale-[0.7] -mt-16 ">
                    <AudioPlayerPreview
                      songs={Object.values(songsData).map((songData) => {
                        return songData;
                      })}
                    />
                  </div>
                </Modal>
              </div>
            }
            isUploadButtonDisabled={isUploadButtonDisabled}
            progressBar={progressBar}
            uploadFileToIpfs={generateManifestFile}
            manifestCid={manifestCid}
            recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
            folderHash={folderHash}
            errorMessage={errorMessage}
            ipnsHash={ipnsHash}
          />
        </div>
        <MintDataNftModal triggerElement={<Button id="mintModalTrigger"></Button>}></MintDataNftModal>
      </div>
    </ErrorBoundary>
  );
};
