import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "./components/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "@libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { AssetCategories, FILES_CATEGORY, IPFS_GATEWAY, SUI_WALRUS_STRATEGY_STRING } from "@utils/constants";
import { toast } from "sonner";
import { generateRandomString, uploadFilesRequest, uploadFilesRequestSUIWalrus, onlyAlphaNumericChars } from "@utils/functions";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "@components/ErrorComponents/ErrorFallbackMusicDataNfts";
import UploadHeader from "./components/UploadHeader";
import DataObjectsList from "./components/DataObjectsList";
import { Modal } from "@components/Modal";
import { AudioPlayerPreview } from "@components/Modals/AudioPlayerPreview";
import MintDataNftModal from "../../components/Modals/MintDataNftModal";
import { useHeaderStore } from "store/header";

type SongData = {
  date: string;
  category: string;
  artist: string;
  album: string;
  title: string;
  file: string;
  cover_art_url: string;
  numbers_nid?: string;
};

type FilePair = {
  image: File;
  audio: File;
};

export const UploadMusicData = () => {
  const location = useLocation();
  const { manifestFile, decentralized } = location.state || {};
  const manifestFileName = manifestFile?.manifestFileName;
  const folderCid = manifestFile?.folderHash;
  const currentManifestFileCID = manifestFile?.hash;
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [manifestCid, setManifestCid] = useState<string>();
  const [recentlyUploadedManifestFileName, setRecentlyUploadedManifestFileName] = useState<string>();
  const [folderHash, setFolderHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [ipnsHash, setIpnsHash] = useState<string>();
  const [sizeToUpload, setSizeToUpload] = useState(0);
  const [modificationMadeInHeader, setModificationMadeInHeader] = useState<boolean>(false);

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        setNumberOfSongs(manifestFile.data_stream.marshalManifest.totalItems + 1);
        setIpnsHash(manifestFile.ipnsHash);
        setRecentlyUploadedManifestFileName(manifestFile.manifestFileName);

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
        toast.error("Error parsing manifest file. Invalid format manifest file fetched : " + (err instanceof Error) ? err.message : "");
      }
    }
  }, [manifestFile]);

  function validateSongsData() {
    let isValid = true;

    if (Object.keys(songsData).length === 0) {
      toast.warning("There are no songs to upload. Please add at least one song to upload.");
      isValid = false;
    } else {
      Object.keys(songsData).forEach((key: string) => {
        isValid = dataAssetObjectValidation(Number(key)) && isValid;
      });
    }

    return isValid;
  }

  function validateUpload() {
    if (!validateSongsData()) {
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

    // check if the songs data has been modified
    for (let idx = 0; idx < Object.keys(songsData).length; idx++) {
      if (!isSongDataObjectEqual(songsData[idx + 1], manifestFile.data[idx])) {
        return true;
      }
    }

    return false;
  };

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
          `${error ? error.message + ". " + error?.response?.data.message : ""} ` +
          " Please check all the fields to be filled correctly."
      );
    }

    filesToUpload.append("category", FILES_CATEGORY); // set the category for files to file
    if (filesToUpload.getAll("files").length === 0) return [];

    // SUI walrus code path for now is on the front end
    let response = null;

    if (manifestFile?.data_stream?.storageStrategy === SUI_WALRUS_STRATEGY_STRING || decentralized === SUI_WALRUS_STRATEGY_STRING) {
      response = await uploadFilesRequestSUIWalrus(filesToUpload, tokenLogin?.nativeAuthToken || "");
    } else {
      response = await uploadFilesRequest(filesToUpload, tokenLogin?.nativeAuthToken || "");
    }

    if (response && response.response) {
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

          let fileToUse = "";
          let coverArtUrlToUse = "";

          if (matchingObjSong) {
            if (matchingObjSong?.isSuiWalrus) {
              fileToUse = `suiwalrus://${matchingObjSong.hash}`;
            } else {
              fileToUse = `${IPFS_GATEWAY}ipfs/${matchingObjSong.folderHash}/${matchingObjSong.fileName}`;
            }
          }

          if (matchingObjImage) {
            if (matchingObjImage?.isSuiWalrus) {
              coverArtUrlToUse = `suiwalrus://${matchingObjImage.hash}`;
            } else {
              coverArtUrlToUse = `${IPFS_GATEWAY}ipfs/${matchingObjImage.folderHash}/${matchingObjImage.fileName}`;
            }
          }

          const songData: Record<any, any> = {
            idx: index + 1,
            date: new Date(songObj?.date).toISOString(),
            category: songObj?.category,
            artist: songObj?.artist,
            album: songObj?.album,
            file: matchingObjSong ? fileToUse : songObj.file,
            cover_art_url: matchingObjImage ? coverArtUrlToUse : songObj.cover_art_url,
            title: songObj?.title,
          };

          if (songObj?.numbers_nid && songObj?.numbers_nid.trim() !== "") {
            songData["numbers_nid"] = songObj.numbers_nid;
          }

          return songData;
        }
      });
      return transformedData.filter((song: any) => song !== null);
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

  const handleAddMoreSongs = () => {
    setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
    setNumberOfSongs((prev) => prev + 1);
  };

  function deleteSong(index: number) {
    const variableSongsData = { ...songsData };
    const variableFilePairs = { ...filePairs };
    const variableValidationErrors = { ...validationErrors };

    if (variableFilePairs[index]) {
      let sizeToRemove = 0;
      if (variableFilePairs[index].audio) sizeToRemove += variableFilePairs[index].audio.size;
      if (variableFilePairs[index].image) sizeToRemove += variableFilePairs[index].image.size;
      setSizeToUpload((prev) => prev - sizeToRemove);
    }

    for (let i = index; i < numberOfSongs - 1; ++i) {
      variableSongsData[i] = variableSongsData[i + 1];
      variableFilePairs[i] = variableFilePairs[i + 1];
      variableValidationErrors[i] = variableValidationErrors[i + 1];
    }

    delete variableSongsData[numberOfSongs - 1];
    delete variableFilePairs[numberOfSongs - 1];
    delete variableValidationErrors[numberOfSongs - 1];

    setSongsData(variableSongsData);
    setFilePairs(variableFilePairs);
    setValidationErrors(variableValidationErrors);
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
    if (first < numberOfSongs - 1 || second !== -1) {
      if (validateSongsData() === false) {
        toast.warning(`Please fill all fields before ${second == -1 ? "deleting" : "swapping the"} songs`);
        return;
      }
    }
    // deleting song with index = first
    if (second === -1) {
      deleteSong(first);
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
    let _sizeToUpload = 0;
    if (image && audio) {
      // Both image and audio files uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { image: image, audio: audio },
      }));

      if (filePairs[index]?.image) _sizeToUpload -= filePairs[index]?.image.size;
      if (filePairs[index]?.audio) _sizeToUpload -= filePairs[index]?.audio.size;
      _sizeToUpload += image.size + audio.size;
    } else if (image) {
      // Only image file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], image: image },
      }));
      if (filePairs[index]?.image) _sizeToUpload -= filePairs[index]?.image.size;
      _sizeToUpload += image.size;
    } else if (audio) {
      // Only audio file uploaded
      setFilePairs((prevFilePairs) => ({
        ...prevFilePairs,
        [index]: { ...prevFilePairs[index], audio: audio },
      }));
      if (filePairs[index]?.audio) _sizeToUpload -= filePairs[index]?.audio.size;
      _sizeToUpload += audio.size;
    }
    setSizeToUpload((prev) => prev + _sizeToUpload);
    setSongsData((prev) => Object.assign({}, prev, { [index]: formInputs }));
    if (validationErrors[index] && validationErrors[index] !== "") {
      dataAssetObjectValidation(index);
    }
  };

  const isSongDataObjectEqual = (songData1: SongData, songData2: SongData) => {
    return (
      songData1.title === songData2.title &&
      songData1.artist === songData2.artist &&
      songData1.album === songData2.album &&
      songData1.category === songData2.category &&
      (songData1?.numbers_nid === songData2?.numbers_nid || (songData1?.numbers_nid === "" && !songData2?.numbers_nid)) &&
      songData1.date.split("T")[0] === songData2.date.split("T")[0]
    );
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
      if (songsData[index]?.numbers_nid && songsData[index].numbers_nid.trim().length < 10) {
        message += "Numbers NID (more than 10 characters) ";
      }
    }

    setValidationErrors((prev) => ({ ...prev, [index]: message.slice(0, -2) }));
    if (message === "") return true;
    return false;
  };

  const handleModalUploadButton = () => {
    document.getElementById("validateUploadButton")?.click();
  };

  const handleOpenMintModal = () => {
    document.getElementById("mintModalTrigger")?.click();
  };

  const storageStrategy = manifestFile?.data_stream?.storageStrategy || decentralized;

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <div className="min-h-[100svh] flex flex-col items-center justify-start rounded-3xl">
          {storageStrategy && (
            <>
              <div className="text-accent">Current Storage Strategy: {storageStrategy}</div>
              {storageStrategy === SUI_WALRUS_STRATEGY_STRING && (
                <p className="text-accent text-center mt-2">🚨 As SUI Walrus is in Beta, you can only create a new asset. Edits are not supported yet!</p>
              )}
            </>
          )}

          <UploadHeader
            title={(manifestFile ? "Update" : "Upload") + " Music Data"}
            folderCid={folderCid}
            manifestFileName={manifestFileName}
            currentManifestFileCID={currentManifestFileCID}
            ipnsHash={ipnsHash}
            dataStream={manifestFile?.data_stream}
            setModificationMadeInHeader={setModificationMadeInHeader}
            disableStream={true}
          />
          <div className="flex flex-row  text-accent pt-4">
            <div>Files to upload: {(sizeToUpload / (1024 * 1024)).toFixed(2)} MB </div>
          </div>
          <DataObjectsList
            DataObjectsComponents={Object.keys(songsData).map((index: any) => (
              <MusicDataNftForm
                key={index}
                index={index}
                lastItem={Number(index) === numberOfSongs - 1}
                song={songsData[index]}
                setterFunction={handleFilesSelected}
                swapFunction={swapSongs}
                validationMessage={validationErrors[index]}
              />
            ))}
            addButton={
              <div className="flex flex-row justify-center items-center gap-8">
                <Button
                  className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}
                  onClick={handleAddMoreSongs}>
                  Add song
                </Button>
                <Modal
                  closeOnOverlayClick={true}
                  modalClassName="p-0 m-0 max-w-[80%]"
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
                    <Button className={"px-8 mt-8 border border-accent bg-background rounded-full hover:shadow  hover:shadow-accent"}>Preview Player</Button>
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
            transformFilesToDataArray={transformSongsData}
            storageType={decentralized}
            validateDataObjects={validateUpload}
            manifestCid={manifestCid}
            recentlyUploadedManifestFileName={recentlyUploadedManifestFileName}
            folderHash={folderHash}
            errorMessage={errorMessage}
            ipnsHash={ipnsHash}
            ipnsKey={manifestFile?.ipnsKey}
            category={AssetCategories.MUSICPLAYLIST}
            setResponsesOnSuccess={setResponsesOnSuccess}
            manifestFile={manifestFile}
          />
        </div>
        <MintDataNftModal triggerElement={<Button id="mintModalTrigger"></Button>}></MintDataNftModal>
      </div>
    </ErrorBoundary>
  );
};
