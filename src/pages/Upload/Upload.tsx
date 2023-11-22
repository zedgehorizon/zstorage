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
  trackFile: any;
  coverArt: any;
};

export const UploadData: React.FC = () => {
  const location = useLocation();
  const { action, type, template, storage, descentralized } = location.state;
  const [songsData, setSongsData] = useState<Record<number, SongData>>({});
  console.log("SONGS DATA", songsData);
  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [isUploadingSongs, setIsUploadingSongs] = useState(false);
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
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuZjU5ODI0MGYxZmQ2ODc4MzQyMmUwNGI1MWVlN2ExNGQ3Yzc0ZjcyZjg5ODM0ZjEzNzM2YmM5YjY0YWJhYmViMi43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURBMk5qRTVPVE45.eb5f2c5572e97a32381bd31ead70a6a61370bb5c60ef9a983766bb69ec79d2d6484f987442b95c007bfd97324b84a06d1731b925aab54d331cb707948ceb3908";
  const apiUrlGet = `${API_URL}/files`;
  const apiUrl = `${API_URL}/upload`; ///refactor this as env file or const

  useEffect(() => {
    console.log("EFFECT", songsData);
  }, [songsData]);

  // upload the songs and images of all the songs
  async function uploadSongsAndImagesFiles() {
    const formData = new FormData();

    //iterating over the songsData and for each object add its image and song to the formData
    Object.values(songsData).forEach((songData, idx) => {
      const appendFileToFormData = (fileArray: any, fileNamePrefix: any) => {
        if (fileArray && fileArray[0] instanceof File) {
          const file = fileArray[0];
          formData.append("files", file, file.name || `${fileNamePrefix}_${idx}`);
        }
      };
      appendFileToFormData(songData.coverArt, "coverArt");
      appendFileToFormData(songData.trackFile, "trackFile");
    });
    try {
      const response = await axios.post(apiUrl, formData, {
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
    console.log("TRANSFORM SONGS DATA");

    //const formData = new FormData();

    // const transformedData = Object.keys(songsData).map((idx: any) => {
    //   const songData = songsData[parseInt(idx)];
    //   //const imageBlob = new Blob([songData.coverArt[0]], { type: songData.coverArt[0].type });

    //   // add for each song object the image file and song
    //   formData.append("files", songData.coverArt[0], songData.coverArt[0]?.name || "custom_filename");
    //   formData.append("files", songData.trackFile[0], songData.trackFile[0]?.name || "custom_filename");

    //   return {
    //     idx: parseInt(idx),
    //     date: new Date(songData.date).toISOString(),
    //     category: songData.category,
    //     artist: songData.artist,
    //     album: songData.album,
    //     // file: "https://dataassets.valhallala.com/file_storage/hack1mus.mp3",
    //     cover_art_url: songData.coverArt,
    //     title: songData.title,
    //   };
    // });
    try {
      const responseDataCIDs = await uploadSongsAndImagesFiles();
      console.log("THE RESPONSE IS : ", responseDataCIDs);

      if (!responseDataCIDs) throw new Error("Upload songs did not work correctly");
      console.log(songsData);
      // Iterate through the second list and find the matching cidv1
      const transformedData = Object.values(songsData).map((songObj, index) => {
        // Find the object in the first list with the same fileName
        console.log("songObj.coverArt[0]?.name", songObj.coverArt[0]?.name);
        console.log("songObj.trach[0]?.name", songObj.trackFile[0]?.name);

        const matchingObjImage = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === songObj.coverArt[0]?.name);
        const matchingObjSong = responseDataCIDs.find((uploadedFileObj: any) => uploadedFileObj.fileName === songObj.trackFile[0]?.name);
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
      console.log("DATA LIST ", transformedData);

      setIsUploadingSongs(false);
      return transformedData;
    } catch (err) {
      console.log("ERROR: ", err);
      setIsUploadingSongs(false);
    }
  }

  const generateManifestFile = async () => {
    ///TODO HERE UPLOAD THE FILES
    // const coverLink = async upload_image()
    // const songURL = upload_song();
    /// maybe add a remove button ??
    console.log("should start transformData");
    const data = await transformSongsData();

    console.log("Transofemed for manifest DATA", data);
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
    console.log("TOJEN", tokenLogin?.nativeAuthToken);

    ///GETTER

    const formDataFormat = new FormData();
    formDataFormat.append("files", new Blob([JSON.stringify(manifest)], { type: "application/json" }), "manifest");
    console.log(formDataFormat);
    try {
      const response = await axios.post(apiUrl, formDataFormat, {
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      if (response.data[0]) setManifestCid(response.data[0].cidv1);
      else {
        throw new Error("The manifest file has not been uploaded correctly");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
    // console.log("swap SONG ", first, second);
    // console.log("FISRT", songsData[first]);
    // console.log("Second", songsData[second]);
    if (first < 1 || second > numberOfSongs) {
      return;
    }

    if (second === -1) {
      // means we want to delete first song
      for (var i = first; i < numberOfSongs - 1; ++i) {
        songsData[i] = songsData[i + 1];
      }
      delete songsData[numberOfSongs - 1];
      setNumberOfSongs((prev) => prev - 1);
      return;
    }

    console.log("SongsData before swap: ", songsData);
    const storeSong = songsData[second];
    // console.log("Store song var", storeSong);
    var songsDataVar = songsData;
    // console.log("ALL songs var ", songsDataVar);

    songsDataVar[second] = songsDataVar[first];
    songsDataVar[first] = storeSong;
    // console.log("SWAPED SONG DATA", songsDataVar);
    console.log("after swap", songsDataVar);
    setSongsData(songsDataVar);
  }

  return (
    <div className="p-4 flex flex-col">
      <b className=" py-2 text-xl  font-medium dark:text-purple-700"> Let’s update your data! Here is what you wanted to do... </b>
      {/* <b className="p-2 text-lg  font-medium  dark:text-blue-400">{props.description} </b> */}
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
            <MusicDataNftForm key={index} index={index} song={songsData[index]} setterFunction={setSongsData} swapFunction={swapSongs}></MusicDataNftForm>
          ))}
        </div>
        <Button onClick={handleAddMoreSongs}> Add more songs</Button>
      </div>
      {!manifestCid ? (
        <button onClick={generateManifestFile} /*disabled={isUploadingSongs}*/ className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
      ) : (
        <p>success : {manifestCid}</p>
      )}
      {isUploadingSongs && <p className="text-green-300">uploading</p>}
    </div>
  );
};
