import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { ToolTip } from "../../libComponents/Tooltip";
import { CopyIcon, InfoIcon } from "lucide-react";

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

export const UploadData: React.FC = (props) => {
  const location = useLocation();
  // const action = state ? state.action : null;
  //const { manifestFile } = location.state || {};
  //const {  } = location.state || {};
  const { manifestFile, action, type, template, storage, descentralized } = location.state || {};
  console.log("upload manifest : ", manifestFile);
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  const [filePairs, setFilePairs] = useState<Record<number, FilePair>>({});

  //console.log("SONGS DATA", songsData);
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
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuNzM5ZmVmZDQ5OWMzN2QyNDUwZmY5ZWI0YjBiYTBjOWRhNWY2ZWM5ZjhlNDk4NzU1MTIzNDIwMmU3NjE1ZWY5Ni43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURFeE5qUTROVFI5.90df575780c87be7ee84c122c6f5c62a759fab2dcb1743ac7318b193463dbf4a1bd5049b6f56a29f4be3ebdd58f689435a3786656468048d893108f1a72dc30b";
  const apiUrlPost = `${API_URL}/upload`; //refactor this as env file

  useEffect(() => {
    if (manifestFile && manifestFile.data_stream) {
      console.log("forms", formData);
      console.log("forms", manifestFile.data);
      const dataStream = manifestFile.data_stream;
      console.log(dataStream);
      setFormData({
        ["name"]: dataStream.name,
        ["creator"]: dataStream.creator,
        ["createdOn"]: dataStream.created_on,
        ["modifiedOn"]: dataStream.last_modified_on,
        ["stream"]: dataStream.marshalManifest.nestedStream === true ? "true" : "false",
        ["totalItems"]: dataStream.marshalManifest.totalItems,
      });
      setNumberOfSongs(dataStream.marshalManifest.totalItems + 1);
      const songsDataMap = manifestFile.data.reduce(
        (acc: any, song: any) => {
          acc[song.idx] = song;
          return acc;
        },
        {} as Record<number, SongData>
      );
      console.log("SOngsData MAP ", songsDataMap);
      setSongsData(songsDataMap);
    }
  }, [manifestFile]);

  // upload the songs and images of all the songs
  async function uploadSongsAndImagesFiles() {
    const formData = new FormData();
    console.log("UPLOADING");
    //iterating over the songsData and for each object add its image and song to the formData
    Object.values(songsData).forEach((songData, idx) => {
      // todo must change the way of storing, its not ok only by title
      if (songData && songData?.title) {
        formData.append("files", filePairs[idx + 1].image, "image." + songData.title); ///   + "-" + filePairs[idx+1].image.name);
        formData.append("files", filePairs[idx + 1].audio, "audio." + songData.title); //+ "-" + filePairs[idx+1].audio.name);
      }
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
      console.error("Error uploading files:", error);
    }
  }

  // get all songs data into the right format for manifest file
  async function transformSongsData() {
    setIsUploadingSongs(true);
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      console.log("THE RESPONSE data IS : ", responseDataCIDs);

      if (!responseDataCIDs) throw new Error("Upload songs did not work correctly");
      // Iterate through the second list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        if (songObj && songObj?.title) {
          const matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === `image.${songObj.title}`);
          const matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === `audio.${songObj.title}`); ///songObj.trackFile[0]?.name);

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
        }
      });

      //console.log("Transformed DATA LIST ", transformedData);

      setIsUploadingSongs(false);
      return transformedData;
    } catch (err) {
      console.log("ERROR: ", err);
      setIsUploadingSongs(false);
    }
  }

  const generateManifestFile = async () => {
    const data = await transformSongsData();
    if (data === undefined) {
      throw new Error("Error transforming the data");
    }
    setIsUploadingManifest(true);

    const manifest = {
      "data_stream": {
        "name": formData.name,
        "creator": formData.creator,
        "created_on": formData.createdOn, // ASK IF HERE I SHOULD PUT THE CURRENT DATE
        "last_modified_on": formData.modifiedOn, /// here the same
        "marshalManifest": {
          "totalItems": numberOfSongs - 1, //formData.totalItems, // same here
          "nestedStream": formData.stream === "true" ? true : false,
        },
      },
      "data": data,
    };
    console.log("Manifest : ", manifest);
    // console.log("TOJEN", tokenLogin?.nativeAuthToken);

    ///GETTER

    const formDataFormat = new FormData();
    formDataFormat.append("files", new Blob([JSON.stringify(manifest)], { type: "application/json" }), "manifest-" + formData.name + "-" + formData.creator);

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
    //console.log(first, second, numberOfSongs);
    if (first < 1 || second >= numberOfSongs) {
      return;
    }

    if (second === -1) {
      const variableSongsData = { ...songsData };
      // means we want to delete song with index first
      for (var i = first; i < numberOfSongs - 1; ++i) {
        variableSongsData[i] = variableSongsData[i + 1];
        variableSongsData[i] = variableSongsData[i + 1];
      }
      delete variableSongsData[numberOfSongs - 1];
      delete filePairs[numberOfSongs - 1];
      setSongsData(variableSongsData);
      setNumberOfSongs((prev) => prev - 1);
      return;
    }

    //console.log("SongsData before swap: ", songsData);

    const storeSong = songsData[second];
    var songsDataVar = { ...songsData };
    songsDataVar[second] = songsDataVar[first];
    songsDataVar[first] = storeSong;
    const storeFile = filePairs[second];
    var storeFilesVar = { ...filePairs };
    storeFilesVar[second] = storeFilesVar[first];
    storeFilesVar[first] = storeFile;
    //console.log("song data set dele", songsData);

    //console.log("after swap", songsDataVar);
    setSongsData(songsDataVar);
    setFilePairs(storeFilesVar);
  }

  const handleFilesSelected = (index: number, formInputs: any, image: File, audio: File) => {
    //console.log("IN PARENT :", index, formInputs, image, audio);
    if (image && audio) setFilePairs(Object.assign({}, filePairs, { [index]: { image: image, audio: audio } }));

    setSongsData((prev) => Object.assign({}, prev, { [index]: formInputs }));
    //console.log("SIR de files", filePairs);
  };

  function copyLink(): void {
    if (manifestCid) navigator.clipboard.writeText(manifestCid);
    else console.log("Error: Manifest is null. Nothing to copy");
  }

  return (
    <div className="p-4 flex flex-col">
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
      <div className="min-h-screen flex flex-col items-center justify-start rounded-3xl bg-black/20">
        <div className="z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50 max-w mx-auto">
          <h1 className="text-2xl font-bold mb-6">Header</h1>
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
                required
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
                required
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
                className="w-full px-3 bg-black/20 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                value={formData.modifiedOn}
                onChange={handleChange}
                className="w-full bg-black/20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="totalItems" className="block text-foreground mb-2">
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
              <label htmlFor="stream" className="block text-foreground mb-2">
                Stream:
              </label>
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
            </div>
          </form>
        </div>
        <div className="mt-4 space-y-8 p-8 rounded-lg shadow-md   ">
          {Object.keys(songsData).map((index: any) => (
            <MusicDataNftForm
              key={index}
              index={index}
              song={songsData[index]}
              setterFunction={handleFilesSelected}
              swapFunction={swapSongs}></MusicDataNftForm>
          ))}
        </div>
        <Button className={"my-4 border border-sky-400 hover:shadow-inner hover:shadow-sky-400"} onClick={handleAddMoreSongs}>
          {" "}
          Add more songs
        </Button>
      </div>
      {!manifestCid ? (
        <button onClick={generateManifestFile} /*disabled={isUploadingSongs}*/ className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-green-400 flex flex-row gap-4">
            Success:
            <a href={manifestCid} target="_blank" className="font-semibold underline text-blue-500">
              {manifestCid}
            </a>
            <CopyIcon onClick={copyLink} className="h-5 w-5 cursor-pointer text-blue-500"></CopyIcon>
          </div>
          <div className="mt-4 mx-auto">
            <ToolTip tooltip="I am tooltip  ">
              <div className="bg-sky-500 w-34 h-12  rounded-full  blur-xl opacity-50">What's next ?</div>
              <div className="z-10 text-xl flex flex-row items-center justify-center -mt-8 ">
                What's next ? <InfoIcon className=" scale-75"></InfoIcon>
              </div>
            </ToolTip>
          </div>
        </div>
      )}
      {isUploadingSongs && <p className="text-green-400">Uploading files</p>}
      {isUploadingManifest && <p className="text-green-400">Uploading manifest file</p>}
    </div>
  );
};
