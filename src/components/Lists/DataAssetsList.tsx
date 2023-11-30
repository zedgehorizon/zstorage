import React, { useEffect, useState } from "react";
import { MusicDataNftForm } from "../../components/InputComponents/MusicDataNftForm";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { ToolTip } from "../../libComponents/Tooltip";
import { CopyIcon, InfoIcon } from "lucide-react";
import DataAssetCard from "../CardComponents/DataAssetCard";

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
  idx: number;
  image: File;
  audio: File;
};
interface DataStream {
  name: string;
  creator: string;
  created_on: string;
  last_modified_on: string;
  marshalManifest: {
    totalItems: number;
    nestedStream: boolean;
  };
}
interface ManifestFile {
  data_stream: DataStream;
  data: [];
  version: number;
}
type DataAsset = {
  fileName: string;
  id: string;
  cid: string;
  cidv1: string;
  mimeType: string;
};
export const DataAssetList: React.FC = () => {
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const { tokenLogin } = useGetLoginInfo();
  const [dataAssetFiles, setDataAssetFiles] = useState<DataAsset[]>([]);
  const [latestVersionCid, setLatestVersionCid] = useState<{ [key: string]: { version: number; cidv1: string } }>({});
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const theToken =
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuZDMwZTYyZTZmZmE2YmZiN2E1N2E4NjYzNjQ0ZmExZmM3Y2UwMzAyMzkwMjRhMDUzOThlYjljNWJjZmNjNjhkYy43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURFek16VXlOemg5.956c0f735682424e733d38bac96cb35590928a3ebd7275a367ff5c11ad48d9782204510ab9ad4bcb44fa6d976c9498e365f431969079616295c42866c29fc60b";
  const apiUrlPost = `${API_URL}/upload`; //refactor this as env file

  // upload the songs and images of all the songs
  async function fetchAllDataAssetsOfAnAddress() {
    const apiUrlGet = `${API_URL}/files`;

    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStoredDataAssets(response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }

  function getManifestFilesFromDataAssets() {
    if (storedDataAssets) {
      const filteredData = storedDataAssets.filter((item) => item.fileName && item.fileName.includes("manifest"));
      console.log("filtered:", filteredData);
      // I got this filteredData list and im trying to only get the latest version of each object, in the fileName will have "1.manifest-..." , " 2.manifest- ... " and i only need to keep the latest version for each different filename

      let latestVersionManifestFile: { [key: string]: { version: number; cidv1: string } } = {};
      filteredData.forEach((item) => {
        const fileName = item.fileName.split(".-")[1]; //   filename format is "1.-manifest-..."
        const version = parseInt(item.fileName.split(".-")[0]);
        if (!fileName) return;
        console.log("Split", item.fileName.split(".-"));

        if (!latestVersionManifestFile[fileName] || version > latestVersionManifestFile[fileName].version) {
          latestVersionManifestFile[fileName] = {
            version: version,
            cidv1: item.cidv1,
          };
        }
      });
      console.log("latestV", latestVersionManifestFile);
      setLatestVersionCid(latestVersionManifestFile);
      setDataAssetFiles(filteredData);
    }
  }

  async function downloadTheManifestFile(version: number, manifestCid: string) {
    const apiUrlDownloadFile = `${API_URL}/file/` + manifestCid;

    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      const versionStampedManifestFile = { ...response.data, version: version };
      setManifestFiles((prev) => [...prev, versionStampedManifestFile]);

      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }
  useEffect(() => {
    fetchAllDataAssetsOfAnAddress();
  }, []);

  useEffect(() => {
    getManifestFilesFromDataAssets();
  }, [storedDataAssets]);

  useEffect(() => {
    Object.entries(latestVersionCid).map(([key, manifestCid]) => {
      downloadTheManifestFile(manifestCid.version, manifestCid.cidv1);
    });
  }, [latestVersionCid]);

  return (
    <div className="p-4 flex flex-col">
      <div className="gap-4 grid grid-cols-3">
        {manifestFiles.map((manifest: ManifestFile, index) => (
          <Link key={index} to={"/upload"} state={{ manifestFile: manifestFiles[index], action: "Update Data Asset", version: manifestFiles[index].version }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
