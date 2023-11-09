import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import { number } from "zod";

type UploadDataProps = {};
const options = {
  action: 0, // update, create
  type: 0, //static, dynamic
  template: 0, // music, trailbrazer , create
  storage: 0, // centralized , descentralized
  descentralized: 0,
};

type SongData = {
  date: string;
  category: string;
  artist: string;
  album: string;
  title: string;
  trackFile: any;
  coverArt: any;
  // Add other properties as needed
};
export const UploadData: React.FC<UploadDataProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  const { action, type, template, storage, descentralized } = location.state;
  console.log("PROPS ", action);
  const [songsData, setSongsData] = useState<Record<string, SongData>>({});
  console.log("SONG DATAAAA", songsData);
  const [numberOfSongs, setNumberOfSongs] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    createdOn: "",
    modifiedOn: "",
    totalItems: 0,
    stream: "no",
  });

  // "data_stream": {
  //   "name": "multiversx_mus:mp3",
  //   "creator": "Leviathon",
  //   "created_on": "2023-05-22T05:37:17Z",
  //   "last_modified_on": "2023-06-10T14:00:19Z",
  //   "marshalManifest": {
  //     "totalItems": 3,
  //     "nestedStream": false
  //   }
  // },
  function transformSongsData() {
    const transformedData = Object.keys(songsData).map((idx) => {
      const songData = songsData[idx];
      return {
        idx: parseInt(idx),
        date: new Date(songData.date).toISOString(),
        category: songData.category,
        artist: songData.artist,
        album: songData.album,
        file: "https://dataassets.valhallala.com/file_storage/hack1mus.mp3", // Replace with the actual URL
        cover_art_url: "https://dataassets.valhallala.com/file_storage/prev.jpg", // Replace with the actual URL
        title: songData.title,
      };
    });

    return transformedData;
  }
  const handleUpload = async () => {
    ///TODO HERE UPLOAD THE FILES
    // const coverLink = async upload_image()
    // const songURL = upload_song();

    // const data = Object.entries(songsData).map(([idx, data]) => {
    //   const song = { idx: parseInt(idx) };
    //   Object.keys(data).forEach((key) => {
    //     song[key] = data[key];
    //   });
    //   return song;
    // });

    // var songsArr = [];
    // var index = 0;
    // for (const [key, value  ] of Object.entries(songsData)) {
    //   console.log(key, value);
    //   songsArr[index] = Object.assign(value, { idx: key });
    // }

    // const songsArray = Object.entries(songsData).forEach((idx: any, values: any) => {
    //   return {
    //     idx: parseInt(idx),
    //     ...values,
    //   };
    // });
    // const updatedSongsArray = songsArray.map((song) => ({
    //   ...song,
    //   ...songsData[song.idx],
    // }));
    const data = transformSongsData();

    const manifest = {
      "data_stream": {
        "name": formData.name,
        "creator": formData.creator,
        "created_on": formData.createdOn, // ASK IF HERE I SHOULD PUT THE CURRENT DATE
        "last_modified_on": formData.modifiedOn, /// here the same
        "marshalManifest": {
          "totalItems": formData.totalItems, // same here
          "nestedStream": formData.stream === "yes" ? true : false,
        },
      },
      "data": data,
    };
    console.log("Manifest :", manifest);
  };

  const handleAddMoreSongs = () => {
    setNumberOfSongs((prev) => prev + 1);
    setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
  };

  // useEffect(() => {
  //   setSongsData((prev) => Object.assign(prev, { [numberOfSongs]: {} }));
  // }, [numberOfSongs]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log("FORM DATA", formData);
  //get data nfts somebody owns, if exist
  // if creating some new data nft then
  return (
    <div className="p-4 flex flex-col">
      <b className=" py-2 text-xl  font-medium dark:text-purple-700"> Let’s update your data! Here is what you wanted to do... </b>
      {/* <b className="p-2 text-lg  font-medium  dark:text-blue-400">{props.description} </b> */}
      <div className="flex flex-row gap-4 mb-4">
        <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          {action}
        </span>
        <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center  text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          {template}
        </span>
        <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          {descentralized ? descentralized : storage}
        </span>
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
                Total Items:{numberOfSongs}
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

            {/* <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600">
              Submit
            </button> */}
          </form>
        </div>
        <div className="space-y-8 p-8 rounded-lg shadow-md ">
          {Object.keys(songsData).map((index: any) => (
            <MusicDataNftForm key={index} index={index} setterFunction={setSongsData}></MusicDataNftForm>
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
