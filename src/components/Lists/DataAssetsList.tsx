import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";

import DataAssetCard from "../CardComponents/DataAssetCard";

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
  const [latestVersionCid, setLatestVersionCid] = useState<{ [key: string]: { version: number; cidv1: string } }>({});
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const theToken =
    "ZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuNWExYWY1ZGY3ZjQ5NzFiOTJhMDQwNDRjMmZmNTIzYTUxYjA5ZmIxZTczYzdhYmM3NDVhNWIxN2M2NWZkZWE2Mi43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTURFMU5URXlNemw5.548e50cdf78e360e566340fc84d5f42673da0bfc64b97b0576db5f96160ce0a4c0a7588ff3ef208a26146003b89794e111771b81c92126eab9fc6db8a3419d0d";

  // fetch all data assets of an address
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

  // get the latest version of the manifest file for each data asset
  function getManifestFilesFromDataAssets() {
    if (storedDataAssets) {
      const filteredData = storedDataAssets.filter((item) => item.fileName && item.fileName.includes("manifest"));

      let latestVersionManifestFile: { [key: string]: { version: number; cidv1: string } } = {};
      filteredData.forEach((item) => {
        const fileName = item.fileName.split(".-")[1]; //   filename format is "1.-manifest-name-creator"
        const version = parseInt(item.fileName.split(".-")[0]);
        if (!fileName) return;

        if (!latestVersionManifestFile[fileName] || version > latestVersionManifestFile[fileName].version) {
          latestVersionManifestFile[fileName] = {
            version: version,
            cidv1: item.cidv1,
          };
        }
      });
      setLatestVersionCid(latestVersionManifestFile);
    }
  }

  // download the manifest file for the coresponding CID
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
