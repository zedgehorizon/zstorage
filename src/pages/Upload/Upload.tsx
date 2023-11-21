import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";

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
  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const { tokenLogin } = useGetLoginInfo();
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    createdOn: "",
    modifiedOn: "",
    totalItems: 0,
    stream: "no",
  });
  const theToken =
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuZGFhNTQxYjQ1MWFhZDVkNzgzNzNiNWNhYTI2NTM1NWE3NzViYWNkNjdmMjAyZTkxNGMwYTA3NmM1NGE5NzE1MS43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURBMU5UUTFOamg5.cbd7a6fe58d859826615cb4111bfffb3ae533fc849bc14c80210c57f3acaa45abad4f51f581aeff69ede21c0634e6e7ae7085c36c5a489889ff6be3904f4c602";
  const apiUrlGet = "https://staging-itheum-api.up.railway.app/files";
  const apiUrl = "https://staging-itheum-api.up.railway.app/upload"; ///refactor this as env file or const

  async function transformSongsData() {
    // maybe add the Cid when the user press save , bcs in this way he can upload, or remove or anyhing one song at a time

    console.log("TRANSFORM SONGS DATA");
    const transformedData = Object.keys(songsData).map(async (idx: any) => {
      const songData = songsData[parseInt(idx)];

      const formData = new FormData();

      formData.append("files", songData.coverArt[0], songData.coverArt[0].name);

      console.log("FILE OF SONGS", songData.trackFile);
      console.log("FILE OF img", songData.coverArt); /// refactor, make a new function to upload
      try {
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "authorization": `Bearer ${theToken}`,
            "Content-Type": "image/jpeg",
          },
        });

        console.log("Response img:", response.data);
        response.data.forEach((file: { fileName: any; cidv1: any }) => {
          if (file.fileName === songData.coverArt[0]?.name) {
            songData.coverArt[0].coverArt = file.cidv1;
            console.log("FOUND", file.cidv1);
            return;
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
      return {
        idx: parseInt(idx),
        date: new Date(songData.date).toISOString(),
        category: songData.category,
        artist: songData.artist,
        album: songData.album,
        file: "https://dataassets.valhallala.com/file_storage/hack1mus.mp3",
        cover_art_url: songData.coverArt,
        title: songData.title,
      };
    });

    return transformedData;
  }

  // const uploadFileToIPFS = async (file?: File) => {
  //   const apiUrl = "https://staging-itheum-api.up.railway.app/upload";

  //   const formData = new FormData();
  //   if (file) formData.append("files", file, "Automobiles Chain-logos_black.png");

  //   // Append JSON data as a blob
  //   const jsonData = {
  //     data_stream: {
  //       name: "",
  //       creator: "",
  //       created_on: "",
  //       last_modified_on: "",
  //       marshalManifest: {
  //         totalItems: 1,
  //         nestedStream: false,
  //       },
  //     },
  //     data: [
  //       {
  //         idx: 1,
  //         date: "2023-10-31T00:00:00.000Z",
  //         category: "sda",
  //         artist: "sad",
  //         album: "sad",
  //         file: "https://dataassets.valhallala.com/file_storage/hack1mus.mp3",
  //         cover_art_url: "https://dataassets.valhallala.com/file_storage/prev.jpg",
  //         title: "sad",
  //       },
  //     ],
  //   };

  //   formData.append("json", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

  //   try {
  //     const response = await axios.post(apiUrl, formData, {
  //       headers: {
  //         "accept": "*/*",
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleUpload = async () => {
    ///TODO HERE UPLOAD THE FILES
    // const coverLink = async upload_image()
    // const songURL = upload_song();
    /// maybe add a remove button ??
    const data = await transformSongsData();

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
    console.log("Manifest :", manifest);
    console.log("TOJEN", tokenLogin?.nativeAuthToken);

    const formDataFormat = new FormData();
    formDataFormat.append("files", new Blob([JSON.stringify(manifest)], { type: "application/json" }), "manifest");
    console.log("getting");
    console.log(formDataFormat);
    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("uploading");
    // try {
    //   const response = await axios.post(apiUrl, formDataFormat, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       "authorization": `Bearer ${theToken}`,
    //     },
    //   });

    //   console.log("Response:", response.data);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
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

    if (first < 1) return;
    if (second > numberOfSongs) return;
    const storeSong = songsData[second];
    // console.log("Store var", storeSong);
    var songsDataVar = songsData;
    // console.log("ALL songs var ", songsDataVar);

    songsDataVar[second] = songsDataVar[first];
    songsDataVar[first] = storeSong;
    // console.log("SWAPED SONG DATA", songsDataVar);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-black/20">
        <div className="bg-purple-800/20 p-8 rounded-lg shadow-md">
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
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Upload
      </button>
    </div>
  );
};
