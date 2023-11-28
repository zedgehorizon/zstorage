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
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const theToken =
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuNWQyZWJiMDE0ZmFiZTg4YjI4MTE3MjY4NTZmOThiMDVkMTEyNDkzZjBiNjZjMmIwY2UzYzgxNGViMjVkZWI1Ni43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURFeE9UQXdNREI5.e4bc5176f9fd7547bcd69d23c8e846ff97194ecb10a9d588924013a12310dd46ba54023a9155f85e23dd96262bce2cf13a72fa5992ba256ae5c2d7ac3a167406";
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
      console.log(response.data);
      setStoredDataAssets(response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }

  function getManifestFilesFromDataAssets() {
    if (storedDataAssets) {
      const filteredData = storedDataAssets.filter((item) => item.fileName && item.fileName.includes("manifest"));
      console.log(filteredData);
      setDataAssetFiles(filteredData);
    }
  }

  async function downloadTheManifestFile(manifestCid: string) {
    const apiUrlDownloadFile = `${API_URL}/file/` + manifestCid;

    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });

      setManifestFiles((prev) => [...prev, response.data]);

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
    dataAssetFiles.map((manifest) => {
      downloadTheManifestFile(manifest.cidv1);
    });
  }, [dataAssetFiles]);

  return (
    <div className="p-4 flex flex-col">
      <div className="gap-4 grid grid-cols-3">
        {manifestFiles.map((manifest: ManifestFile, index) => (
          <Link key={index} to={"/upload"} state={{ manifestFile: manifestFiles[index], action: "Update Data Asset" }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
