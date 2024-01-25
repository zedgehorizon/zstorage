import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "./components/MusicDataNftForm";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";

import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { IPFS_GATEWAY } from "../../utils/constants";
import { Lightbulb, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { theToken } from "../../utils/constants";
import { generateRandomString, uploadFilesRequest } from "../../utils/utils";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "../../components/ErrorComponents/ErrorFallbackMusicDataNfts";

import UploadHeader from "./components/UploadHeader";
import DataObjectsList from "./components/DataObjectsList";

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
  const location = useLocation();

  const { currentManifestFileCID, manifestFile, action, type, template, storage, decentralized, version, manifestFileName, folderCid } = location.state || {};
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<boolean[]>([]);

  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  // const theToken = tokenLogin?.nativeAuthToken;

  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(true);
  const [isUploadingManifest, setIsUploadingManifest] = useState(false);

  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [modifiedOn, setModifiedOn] = useState(new Date().toISOString().split("T")[0]);
  const [progressBar, setProgressBar] = useState(0);

  const [manifestCid, setManifestCid] = useState(null);
  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setName(dataStream.name);
        setCreator(dataStream.creator);
        setCreatedOn(dataStream.created_on);
        setModifiedOn(new Date(dataStream.last_modified_on).toISOString().split("T")[0]);
        setNumberOfSongs(dataStream.marshalManifest.totalItems + 1);
        const songsDataMap = manifestFile.data.reduce(
          (acc: any, song: any) => {
            if (song) acc[song.idx] = song;
            return acc;
          },
          {} as Record<number, SongData>
        );
        setSongsData(songsDataMap);
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
              generateRandomString() + "." + "image" + "_" + songData.title + "." + filePairs[idx + 1].image.name.split(".")[1]
            );
          }
          if (filePairs[idx + 1]?.audio) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].audio,
              generateRandomString() + "." + "audio" + "_" + songData.title + "." + filePairs[idx + 1].audio.name.split(".")[1]
            );
          }
        }
      });
    } catch (error: any) {
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

    if (filesToUpload.getAll("files").length === 0) return [];

    const response = await uploadFilesRequest(filesToUpload, theToken);
    return response;
  }

  // async function uploadFilesRequest(filesToUpload: FormData) {
  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_ENV_BACKEND_API}/upload${API_VERSION}`, filesToUpload, {
  //       headers: {
  //         "authorization": `Bearer ${theToken}`,
  //       },
  //     });

  //     return response.data;
  //   } catch (error: any) {
  //     console.error("Error uploading files:", error);
  //     if (error?.response.data.statusCode === 403) {
  //       toast("Native auth token expired. Re-login and try again! ", {
  //         icon: <Lightbulb color="yellow"></Lightbulb>,
  //       });
  //     }
  //     toast.error("Error uploading files to Ipfs: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`, {
  //       icon: (
  //         <button onClick={() => toast.dismiss()}>
  //           <XCircle color="red" />
  //         </button>
  //       ),
  //     });
  //   }
  // }

  /**
   * Get all songs data into the right format for manifest file
   * Transforms the songs data and uploads the songs and images files.
   * @returns {Array<Object>} The transformed data of the songs.
   * @throws {Error} If the upload songs import.meta did not work correctly or if the data has not been uploaded correctly.
   */
  async function transformSongsData() {
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      if (progressBar < 60) setProgressBar(60);
      if (!responseDataCIDs) return;
      // Iterate through the response list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        if (songObj && songObj?.title) {
          let matchingObjImage;
          let matchingObjSong;
          const fileObj = filePairs[index + 1];
          if (fileObj) {
            if (fileObj.image && fileObj.image.name) {
              matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName.includes(`.image_${songObj.title}`));
              if (!matchingObjImage) throw new Error("The data has not been uploaded correctly. Image CID could not be found ");
            }
            if (fileObj.audio && fileObj.audio.name) {
              matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName.includes(`.audio_${songObj.title}`));
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
    setProgressBar(12);
    if (!verifyHeaderFields()) {
      return;
    }

    try {
      setIsUploadingManifest(true);
      const data = await transformSongsData();
      if (data === undefined) {
        setIsUploadingManifest(false);
        return;
      }
      if (progressBar < 80) setProgressBar(80);
      const manifest = {
        "data_stream": {
          "name": name,
          "creator": creator,
          "created_on": createdOn,
          "last_modified_on": new Date().toISOString().split("T")[0],
          "marshalManifest": {
            "totalItems": numberOfSongs - 1,
            "nestedStream": "true", // set to true for MUSIC DATA NFTs
          },
        },
        "data": data,
      };
      const formDataFormat = new FormData();
      formDataFormat.append(
        "files",
        new Blob([JSON.stringify(manifest)], { type: "application/json" }),
        manifestFileName ? manifestFileName : "manifest" + generateRandomString() + "_" + name + ".json"
      );
      const response = await uploadFilesRequest(formDataFormat, theToken);
      if (response[0]) {
        const ipfs: any = "ipfs/" + response[0]?.folderHash + "/" + response[0]?.fileName;
        setManifestCid(ipfs);

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

      setIsUploadingManifest(false);
      console.error("Error generating the manifest file:", error);
    }
    setIsUploadingManifest(false);
    setProgressBar(100);
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

  // check whether the upload button should be disabled or not
  useEffect(() => {
    let hasUnsavedChanges = false;

    if (numberOfSongs > 1 && songsData[1].title) {
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
  }, [songsData, unsavedChanges, name, creator, createdOn]);

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

  // console.log("songsData: ", songsData);
  // console.log("filePairs: ", filePairs);
  // console.log("manifestFile: ", manifestFile);
  // console.log("formData: ", formData);
  // // console.log("totalItems: ", numberOfSongs);
  // console.log("manifestCid: ", manifestCid);
  // console.log("unsavedChanges: ", unsavedChanges);

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        {/* <SelectionList items={[action, type, template, storage, decentralized]} /> */}

        <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl  ">
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
                setUnsavedChanges={(index: number, value: boolean) => setUnsavedChanges({ ...unsavedChanges, [index]: value })}></MusicDataNftForm>
            ))}
            addButton={
              <div className="flex flex-col justify-center items-center">
                <Button
                  className={"px-8 mt-8  border border-accent bg-background rounded-full  hover:shadow  hover:shadow-accent"}
                  onClick={handleAddMoreSongs}>
                  Add song
                </Button>
              </div>
            }
            isUploadButtonDisabled={isUploadButtonDisabled}
            progressBar={progressBar}
            generateManifestFile={generateManifestFile}
            manifestCid={manifestCid}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};