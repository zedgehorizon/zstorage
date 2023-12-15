import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { ToolTip } from "../../libComponents/Tooltip";
import { CopyIcon, InfoIcon, Lightbulb, XCircle } from "lucide-react";
import ProgressBar from "../../components/ProgressBar";
import toast, { Toaster } from "react-hot-toast";

import { theToken } from "../../utils/constants";
import { generateRandomString } from "../../utils/utils";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackMusicDataNfts from "../../components/ErrorComponents/ErrorFallbackMusicDataNfts";
import { Err } from "@multiversx/sdk-core/out";
import { error } from "console";

// todo verify and dont allow users to upload manifest files without songs
// todo when reloading after uploading a manifest file, make it to show the new manifest file not the old one
//todo add a modal after the upload with whats next
///remove save button

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

export const UploadData: React.FC = (props) => {
  const location = useLocation();

  const { ipnsKey, currentManifestFileCID, manifestFile, action, type, template, storage, descentralized, version } = location.state || {};
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<boolean[]>([]);

  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(true);
  const [isUploadingManifest, setIsUploadingManifest] = useState(false);

  const [progressBar, setProgressBar] = useState(0);
  const [manifestCid, setManifestCid] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    createdOn: manifestFile && manifestFile.data_stream.created_on ? manifestFile.data_stream.created_on : new Date().toISOString().split("T")[0],
    modifiedOn: new Date().toISOString().split("T")[0],
    totalItems: 0,
    stream: "true",
  });

  const isIPNS = descentralized?.includes("IPNS") || (ipnsKey ? true : false);

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      try {
        const dataStream = manifestFile.data_stream;
        setFormData({
          ["name"]: dataStream.name,
          ["creator"]: dataStream.creator,
          ["createdOn"]: dataStream.created_on,
          ["modifiedOn"]: new Date(dataStream.last_modified_on).toISOString().split("T")[0],
          ["stream"]: dataStream.marshalManifest.nestedStream === true ? "true" : "false",
          ["totalItems"]: dataStream.marshalManifest.totalItems,
        });
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
        console.log("ERROR parsing manifest file : ", err);

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

  // upload the songs and images of all the songs
  async function uploadSongsAndImagesFiles() {
    console.log("Starting to upload songs and images files");
    /// refactor , iterate through the files, not through the songsData
    const filesToUpload = new FormData();
    try {
      //iterating over the songsData and for each object add its image and song to the formData
      Object.values(songsData).forEach((songData, idx) => {
        if (songData && songData?.title && filePairs[idx + 1]) {
          if (filePairs[idx + 1]?.image) {
            filesToUpload.append(
              "files",
              filePairs[idx + 1].image,
              (version ? version + 1 : "1") + ".-image." + songData.title + ".-" + generateRandomString() + "." + filePairs[idx + 1].image.name.split(".")[1]
            );
          }
          if (filePairs[idx + 1]?.audio)
            filesToUpload.append(
              "files",
              filePairs[idx + 1].audio,
              (version ? version + 1 : "1") + ".-audio." + songData.title + ".-" + generateRandomString() + "." + filePairs[idx + 1].audio.name.split(".")[1]
            );
        }
      });
    } catch (err) {
      console.log("ERROR iterating through songs Data : ", err);
      toast.error(
        "Error iterating through songs Data : " + `${err instanceof Error ? err.message : ""}` + " Please check all the fields to be filled correctly.",
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
    console.log("filesToUpload", filesToUpload.getAll("files"));
    const response = await uploadFilesRequest(filesToUpload);
    return response;
  }

  async function uploadFilesRequest(filesToUpload: FormData) {
    const uploadURL = `${API_URL}/${ipnsKey || descentralized.includes("IPNS") ? "upload_v2" : "upload"}`;
    console.log("uploadURL", uploadURL);
    try {
      const response = await axios.post(uploadURL, filesToUpload, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      console.log("THE RESPONSE OF UPLOAD REQ : " + response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error uploading files:", error);
      if (error?.response.data.statusCode === 403) {
        /// forbidden  - token expired
        toast("Native auth token expired. Re-login and try again! ", {
          icon: <Lightbulb color="yellow"></Lightbulb>,
        });
      }
      toast.error("Error uploading files to Ipfs: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
    }
  }

  /**
   * Get all songs data into the right format for manifest file
   * Transforms the songs data and uploads the songs and images files.
   * @returns {Array<Object>} The transformed data of the songs.
   * @throws {Error} If the upload songs process did not work correctly or if the data has not been uploaded correctly.
   */
  async function transformSongsData() {
    setProgressBar(20);
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      console.log("responseDataCIDs upload files ", responseDataCIDs);

      if (!responseDataCIDs) return;

      // Iterate through the response list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        if (songObj && songObj?.title) {
          let matchingObjImage;
          let matchingObjSong;
          const fileObj = filePairs[index + 1];
          if (fileObj) {
            if (fileObj.image && fileObj.image.name) {
              matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) =>
                uploadedFileObj.fileName.includes((version ? version + 1 : "1") + `.-image.${songObj.title}`)
              );
              if (!matchingObjImage) throw new Error("The data has not been uploaded correctly. Image CID could not be found ");
            }
            if (fileObj.audio && fileObj.audio.name) {
              matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) =>
                uploadedFileObj.fileName.includes((version ? version + 1 : "1") + `.-audio.${songObj.title}`)
              );
              if (!matchingObjSong) throw new Error("The data has not been uploaded correctly. Song CID could not be found ");
            }
          }
          console.log("matchingObjImage", matchingObjImage);
          console.log("responseDataCIDs", responseDataCIDs);
          return {
            idx: index + 1,
            date: new Date(songObj?.date).toISOString(),
            category: songObj?.category,
            artist: songObj?.artist,
            album: songObj?.album,
            file: matchingObjSong
              ? `https://ipfs.io/ipfs/${isIPNS ? matchingObjSong.folderHash : matchingObjSong.folderCidv1}/${matchingObjSong.fileName}`
              : songObj.file,
            cover_art_url: matchingObjImage
              ? `https://ipfs.io/ipfs/${isIPNS ? matchingObjImage.folderHash : matchingObjImage.folderCidv1}/${matchingObjImage.fileName}`
              : songObj.cover_art_url,
            title: songObj?.title,
          };
        }
      });
      // return only the songs that are not null in case there are any empty songs
      return transformedData.filter((song: any) => song !== null);
    } catch (error: any) {
      toast.error("Error transforming the data: " + `${error ? error?.message + ". " + error?.response?.data.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
      console.log("ERROR transforming the data: ", error);
    }
  }

  function verifyHeaderFields() {
    if (!formData.name || !formData.creator || !formData.createdOn || !songsData) {
      toast.error("Please fill all the fields from the header section", {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <Lightbulb color="yellow" />
          </button>
        ),
      });
      return false;
    }
    return true;
  }

  async function addToIpns(hash: string) {
    console.log("ADD", hash);

    try {
      const response = await axios.get(`${API_URL}/ipns/publish`, {
        params: { cid: hash, key: ipnsKey }, // maybe will throw error if there is no ipns key
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response adding to ipns: ", response.data);
      return response.data.hash;
    } catch (error) {
      console.error(error);
      throw error; // error to be catched by toast.promise
    }
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

      setProgressBar(60);

      const manifest = {
        "data_stream": {
          "name": formData.name,
          "creator": formData.creator,
          "created_on": formData.createdOn,
          "last_modified_on": version ? new Date().toISOString() : formData.createdOn,
          "marshalManifest": {
            "totalItems": numberOfSongs - 1,
            "nestedStream": formData.stream === "true" ? true : false,
          },
        },
        "data": data,
      };

      const formDataFormat = new FormData();
      formDataFormat.append(
        "files",
        new Blob([JSON.stringify(manifest)], { type: "application/json" }),
        (version ? version + 1 : "1") + ".-manifest-" + formData.name + "-" + formData.creator + ".-" + generateRandomString() + ".json"
      );
      const response = await uploadFilesRequest(formDataFormat);
      console.log(response[0], "MANIFEST file uploaded successfully");
      let ipfs: any = "";
      if (isIPNS) {
        const ipnsHash = await addToIpns(response[0].hash);
        ipfs = "ipns/" + ipnsHash; //"/" + response[0]?.fileName;
      } else {
        ipfs = "ipfs/" + response[0]?.folderCid + "/" + response[0]?.fileName;
      }
      if (response[0]) setManifestCid(ipfs);
      else {
        throw new Error("The manifest file has not been uploaded correctly ");
      }
    } catch (error) {
      toast.error("Error generating the manifest file: " + `${error instanceof Error ? error.message : ""}`, {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });

      setIsUploadingManifest(false);
      console.log("Error generating the manifest file:", error);
    }
    setIsUploadingManifest(false);
    setProgressBar(100);
  };

  const handleAddMoreSongs = () => {
    setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
    setNumberOfSongs((prev) => prev + 1);
    setUnsavedChanges((prev) => ({ ...prev, [numberOfSongs]: true }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  // ask Mark if there should not be a better way like to only show errrs to the user when trying to upload the manifest file
  useEffect(() => {
    let errorMessage = "";
    if (numberOfSongs > 1 && songsData[1].title) {
      let hasUnsavedChanges = false;
      if (Object.keys(unsavedChanges).length === 0) hasUnsavedChanges = true;
      Object.values(unsavedChanges).forEach((item) => {
        if (item === true) {
          hasUnsavedChanges = true;
        }
      });
      if (hasUnsavedChanges) {
        errorMessage = "Please save all the changes before uploading the data";
      }
    } else {
      errorMessage = "Please fill all the fields from the songs section";
    }
    if (errorMessage !== "") {
      setIsUploadButtonDisabled(true);
    } else {
      setIsUploadButtonDisabled(false);
    }
  }, [songsData, unsavedChanges]);

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

    // deleting song with index first
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

  /// copy the link to clipboard
  function copyLink(text: string): void {
    if (text) navigator.clipboard.writeText(text);
    else
      toast.error("Error copying the link to clipboard. Link is empty.", {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
  }

  // console.log("songsData: ", songsData);
  // console.log("filePairs: ", filePairs);
  // console.log("manifestFile: ", manifestFile);
  // console.log("formData: ", formData);
  // console.log("totalItems: ", numberOfSongs);
  // console.log("manifestCid: ", manifestCid);
  // console.log("unsavedChanges: ", unsavedChanges);

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallbackMusicDataNfts error={error} />}>
      <div className="p-4 flex flex-col">
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            position: "sticky",
            top: "0",
            right: "0",
            width: "100%",
          }}
          toastOptions={{
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
            },
          }}
        />
        <b className=" py-2 text-xl  font-medium"> Let’s update your data! Here is what you wanted to do... </b>
        <div className="flex flex-row gap-4 mb-4">
          {action && (
            <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {action}
            </span>
          )}
          {type && (
            <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {type}
            </span>
          )}
          {template && (
            <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center  text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {template}
            </span>
          )}
          {storage && (
            <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {descentralized ? descentralized : storage}
            </span>
          )}
        </div>
        <div className="z-[-1] relative w-full ">
          <div className="absolute top-30 left-20 w-96 h-72 bg-sky-500/70 rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-4000"></div>

          <div className="absolute top-0 -left-4 w-96 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob "></div>
          <div className="absolute top-0 -right-4 w-72 h-96 bg-[#300171] rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-2000"></div>
          <div className="absolute top-30 -left-20 w-96 h-72 bg-sky-500/70 rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-4000"></div>
          <div className="absolute top-20 -left-20 w-96 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob "></div>
        </div>
        {/** Refactor this into a Header component */}
        <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl bg-black/20">
          <div className="z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
            <div className="flex flex-row gap-8 items-center">
              <h1 className="text-2xl font-bold mb-6">Header </h1>

              <div className="ml-auto flex flex-col">
                <h3> {version && `Version:  ${version}`}</h3>
                <label htmlFor="totalItems" className="block text-foreground ">
                  Total Items: {numberOfSongs - 1}
                </label>
              </div>
            </div>
            <form className="flex gap-x-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-foreground mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 bg-black/20 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required={true}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="creator" className="block text-foreground mb-2">
                  Creator:
                </label>
                <input
                  type="text"
                  id="creator"
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  className="w-full bg-black/20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required={true}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="createdOn" className="block text-foreground mb-2">
                  Created On:
                </label>
                <input
                  type="date"
                  id="createdOn"
                  name="createdOn"
                  value={formData.createdOn}
                  onChange={handleChange}
                  className="w-full px-3 bg-black/20 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
                  required={true}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="modifiedOn" className="block text-foreground mb-2">
                  Modified On:
                </label>
                <input
                  type="date"
                  id="modifiedOn"
                  name="modifiedOn"
                  disabled={true}
                  value={formData.modifiedOn}
                  onChange={handleChange}
                  className="w-full bg-black/20 px-3 py-2   rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* { template !== "Music Data Nft" && <div className="mb-4">
              <ToolTip tooltip="Music Data Nft shoud be streamed- select yes">
                <label htmlFor="stream" className="block text-foreground mb-2">
                  Stream:
                </label>
              </ToolTip> 
              <div className="flex items-center">
                <input type="radio" id="streamYes" name="stream" value="true" checked={formData.stream === "true"} onChange={handleChange} className="mr-2" />
                <label htmlFor="streamYes" className="text-foreground mr-4 cursor-pointer">
                  Yes
                </label>
                <input type="radio" id="streamNo" name="stream" value="false" checked={formData.stream === "false"} onChange={handleChange} className="mr-2" />
                <label htmlFor="streamNo" className="text-foreground cursor-pointer">
                  No
                </label>
              </div>
            </div> } 
              */}
            </form>
          </div>
          {currentManifestFileCID && <h3 className="mt-4"> Manifest CID - {currentManifestFileCID} </h3>}
          {ipnsKey && <h3 className="mt-4"> Ipns Key - {ipnsKey} </h3>}

          <ErrorBoundary
            onError={(err) => <ErrorFallbackMusicDataNfts error={err} />}
            FallbackComponent={({ error, resetErrorBoundary }) => <ErrorFallbackMusicDataNfts error={error} />}>
            <div className="mt-4 space-y-8 p-8 rounded-lg shadow-md   ">
              {Object.keys(songsData).map((index: any) => (
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
            </div>
          </ErrorBoundary>

          <Button className={"my-4 border border-sky-400 hover:shadow-inner hover:shadow-sky-400"} onClick={handleAddMoreSongs}>
            {" "}
            Add more songs
          </Button>
        </div>
        {!manifestCid ? (
          <button
            onClick={generateManifestFile}
            disabled={isUploadButtonDisabled}
            className={"bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-500/10"}>
            Upload
          </button>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center p-8">
              <ToolTip tooltip="It might take more than 10 min for the files to get pinned and to be visible">
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="text-green-400 flex flex-row gap-4">
                    Success:
                    <a href={"https://ipfs.io/" + manifestCid} target="_blank" className="font-semibold underline text-blue-500">
                      {"https://ipfs.io/" + manifestCid}
                    </a>
                    <CopyIcon onClick={() => copyLink("https://ipfs.io/" + manifestCid)} className="h-5 w-5 cursor-pointer text-blue-500"></CopyIcon>
                  </div>
                  <div className="text-green-400 flex flex-row gap-4">
                    {manifestCid}
                    <CopyIcon onClick={() => copyLink(manifestCid)} className="h-5 w-5 cursor-pointer text-blue-500"></CopyIcon>
                  </div>
                </div>
              </ToolTip>

              <div className="mt-4 mx-auto">
                <ToolTip
                  tooltip=""
                  tooltipBox={
                    <div className="w-[400px] relative z-10 p-4 text-sm leading-relaxed text-white bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl">
                      <ol className="list-decimal ml-4">
                        <p>To point a subdomain to your IPFS file after generating its hash via zStorage, follow these refined steps:</p>
                        <li>
                          <p>Access Domain Controller: Open the control panel of your domain provider.</p>
                        </li>
                        <li>
                          <p>
                            CNAME Record Setup: Add a CNAME record for your domain. Specify the subdomain you wish to use. Point this subdomain to a public IPFS
                            gateway, such as "ipfs.namebase.io."
                          </p>
                        </li>
                        <li>
                          <p>Obtain IPFS Manifest Hash: Retrieve the IPFS manifest hash from your zStorage.</p>
                        </li>
                        <li>
                          <p>
                            DNSLink TXT Record: Create a new TXT record. Name it _dnslink.yoursubdomain and set its value to dnslink=/ipfs/"IPFS manifest file
                            hash."
                          </p>
                        </li>
                        <li>Response header modification: In the response header add "x-amz-meta-marshal-deep-fetch" with value 1 </li>
                        <li>
                          <p>This will effectively link your subdomain to the IPFS file using DNS records.</p>
                        </li>
                      </ol>
                    </div>
                  }>
                  <div className="bg-sky-500 w-34 h-12  rounded-full  blur-xl opacity-50"> </div>
                  <div className="z-10 text-xl flex flex-row items-center justify-center -mt-8 ">
                    What's next ? <InfoIcon className=" scale-75"></InfoIcon>
                  </div>
                </ToolTip>
              </div>
            </div>
          </div>
        )}
        {isUploadingManifest && progressBar < 100 && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-5 "></div>}
        {isUploadingManifest && progressBar < 100 && <ProgressBar progress={progressBar} />}
      </div>
    </ErrorBoundary>
  );
};
