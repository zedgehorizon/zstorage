import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";

type SongData = {
  date: string;
  category: string;
  artist: string;
  album: string;
  title: string;
  trackFile: string;
  coverArt: string;
};
type FilePair = {
  idx: number;
  image: File;
  audio: File;
};

export const UploadData: React.FC = () => {
  const location = useLocation();
  const { action, type, template, storage, descentralized } = location.state;
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});

  console.log("SONGS DATA", songsData);
  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [isUploadingSongs, setIsUploadingSongs] = useState(false);
  const [isUploadingManifest, setIsUploadingManifest] = useState(false);

  const [manifestCid, setManifestCid] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    createdOn: "",
    modifiedOn: "",
    totalItems: 0,
    stream: "no",
  });
  const theToken =
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuNDIxMmFmOTg1NDI5ZjllMmE3YWZiNzk0YzFmYTU4ZGFkMDIyNWFkNDczODc4MzI0MGM2ZTg2MDIyNDgzMzJkOC43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURBM05URXdORGg5.67488297b3064378019343f20a41a593072b6acbd8c35a0c19916c7bf8de51eb1d2172bc76ffffd694dd7269dab215930404c0a4fe83b0d72a75aa66fd3a360f";
  //const apiUrlGet = `${API_URL}/files`;
  const apiUrlPost = `${API_URL}/upload`; //refactor this as env file or const

  useEffect(() => {
    console.log("EFFECT", songsData);
  }, [songsData]);

  // upload the songs and images of all the songs
  async function uploadSongsAndImagesFiles() {
    const formData = new FormData();

    //iterating over the songsData and for each object add its image and song to the formData
    Object.values(songsData).forEach((songData, idx) => {
      // todo must change the way of storing, its not ok only by title
      formData.append("files", filePairs[idx + 1].image, "image." + songData.title); ///   + "-" + filePairs[idx+1].image.name);
      formData.append("files", filePairs[idx + 1].audio, "audio." + songData.title); //+ "-" + filePairs[idx+1].audio.name);
    });
    try {
      const response = await axios.post(apiUrlPost, formData, {
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // get all songs data into the right format for manifest file
  async function transformSongsData() {
    setIsUploadingSongs(true);
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      console.log("THE RESPONSE IS : ", responseDataCIDs);

      if (!responseDataCIDs) throw new Error("Upload songs did not work correctly");
      // Iterate through the second list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        const matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === `image.${songObj.title}`);
        const matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === `audio.${songObj.title}`); ///songObj.trackFile[0]?.name);
        console.log("matchimg", matchingObjImage);
        // if the file were not found throw error
        if (!matchingObjImage || !matchingObjSong) {
          throw new Error("The data has not been uploaded correctly. CID could not be found");
        }
        return {
          idx: index + 1,
          date: new Date(songObj?.date).toISOString(),
          category: songObj?.category,
          artist: songObj?.artist,
          album: songObj?.album,
          file: `ipfs://${matchingObjSong.cidv1}`,
          cover_art_url: `ipfs://${matchingObjImage.cidv1}`,
          title: songObj?.title,
        };
      });
      console.log("Transformed DATA LIST ", transformedData);

      setIsUploadingSongs(false);
      return transformedData;
    } catch (err) {
      console.log("ERROR: ", err);
      setIsUploadingSongs(false);
    }
  }

  const generateManifestFile = async () => {
    const data = await transformSongsData();
    setIsUploadingManifest(true);

    const manifest = {
      "data_stream": {
        "name": formData.name,
        "creator": formData.creator,
        "created_on": formData.createdOn, // ASK IF HERE I SHOULD PUT THE CURRENT DATE
        "last_modified_on": formData.modifiedOn, /// here the same
        "marshalManifest": {
          "totalItems": numberOfSongs - 1, //formData.totalItems, // same here
          "nestedStream": formData.stream === "yes" ? true : false,
        },
      },
      "data": data,
    };
    console.log("Manifest : ", manifest);
    // console.log("TOJEN", tokenLogin?.nativeAuthToken);

    ///GETTER

    const formDataFormat = new FormData();
    formDataFormat.append("files", new Blob([JSON.stringify(manifest)], { type: "application/json" }), formData.name + "-" + formData.creator);

    try {
      const response = await axios.post(apiUrlPost, formDataFormat, {
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response upload manifest:", response.data);
      const ipfs: any = "ipfs://" + response.data[0].cidv1;
      if (response.data[0]) setManifestCid(ipfs);
      else {
        throw new Error("The manifest file has not been uploaded correctly");
      }
    } catch (error) {
      setIsUploadingManifest(false);
      console.error("Error:", error);
    }
    setIsUploadingManifest(false);
  };

  const handleAddMoreSongs = () => {
    setNumberOfSongs((prev) => prev + 1);
    setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function swapSongs(first: number, second: number) {
    if (first < 1 || second > numberOfSongs) {
      return;
    }

    if (second === -1) {
      // means we want to delete song with index first
      for (var i = first; i < numberOfSongs - 1; ++i) {
        songsData[i] = songsData[i + 1];
        filePairs[i] = filePairs[i + 1];
      }
      delete songsData[numberOfSongs - 1];
      delete filePairs[numberOfSongs - 1];
      setNumberOfSongs((prev) => prev - 1);
      return;
    }

    //console.log("SongsData before swap: ", songsData);
    const storeSong = songsData[second];
    var songsDataVar = songsData;
    songsDataVar[second] = songsDataVar[first];
    songsDataVar[first] = storeSong;

    const storeFile = filePairs[second];
    var storeFilesVar = filePairs;
    storeFilesVar[second] = storeFilesVar[first];
    storeFilesVar[first] = storeFile;

    console.log("after swap", songsDataVar);
    setSongsData(songsDataVar);
    setFilePairs(storeFilesVar);
  }

  const handleFilesSelected = (index: number, formInputs: any, image: File, audio: File) => {
    console.log("IN PARENT :", index, formInputs, image, audio);
    if (image && audio) setFilePairs(Object.assign({}, filePairs, { [index]: { image: image, audio: audio } }));

    setSongsData((prev) => Object.assign({}, prev, { [index]: formInputs }));
    console.log("SIR de files", filePairs);
  };

  return (
    <div className="p-4 flex flex-col">
      <b className=" py-2 text-xl  font-medium dark:text-purple-700"> Let’s update your data! Here is what you wanted to do... </b>
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
        {action && (
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
      <div className="min-h-screen flex flex-col items-center justify-start bg-black/20">
        <div className="z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
          <h1 className="text-2xl font-bold mb-6">Header</h1>
          <form className="flex gap-x-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 bg-black/20 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="creator" className="block text-gray-600 mb-2">
                Creator:
              </label>
              <input
                type="text"
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="w-full bg-black/20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="createdOn" className="block text-gray-600 mb-2">
                Created On:
              </label>
              <input
                type="date"
                id="createdOn"
                name="createdOn"
                value={formData.createdOn}
                onChange={handleChange}
                className="w-full px-3 bg-black/20 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="modifiedOn" className="block text-gray-600 mb-2">
                Modified On:
              </label>
              <input
                type="date"
                id="modifiedOn"
                name="modifiedOn"
                value={formData.modifiedOn}
                onChange={handleChange}
                className="w-full bg-black/20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="totalItems" className="block text-gray-600 mb-2">
                Total Items:{numberOfSongs - 1}
              </label>
              {/* <input
                type="number"
                id="totalItems"
                name="totalItems"
                value={formData.totalItems}
                onChange={handleChange}
                className="w-full bg-black/20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                min="0"
              /> */}
            </div>

            <div className="mb-4">
              <label htmlFor="stream" className="block text-gray-600 mb-2">
                Stream:
              </label>
              <div className="flex items-center">
                <input type="radio" id="streamYes" name="stream" value="yes" checked={formData.stream === "yes"} onChange={handleChange} className="mr-2" />
                <label htmlFor="streamYes" className="text-gray-700 mr-4 cursor-pointer">
                  Yes
                </label>
                <input type="radio" id="streamNo" name="stream" value="no" checked={formData.stream === "no"} onChange={handleChange} className="mr-2" />
                <label htmlFor="streamNo" className="text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="space-y-8 p-8 rounded-lg shadow-md ">
          {Object.keys(songsData).map((index: any) => (
            <MusicDataNftForm
              key={index}
              index={index}
              song={songsData[index]}
              setterFunction={handleFilesSelected}
              swapFunction={swapSongs}></MusicDataNftForm>
          ))}
        </div>
        <Button onClick={handleAddMoreSongs}> Add more songs</Button>
      </div>
      {!manifestCid ? (
        <button onClick={generateManifestFile} /*disabled={isUploadingSongs}*/ className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
      ) : (
        <a className="text-green-400" href={manifestCid} target="_blank">
          Success : {manifestCid}
        </a>
      )}
      {isUploadingSongs && <p className="text-green-300">Uploading files</p>}
      {isUploadingManifest && <p className="text-green-300">Uploading manifest file</p>}
    </div>
  );
};
