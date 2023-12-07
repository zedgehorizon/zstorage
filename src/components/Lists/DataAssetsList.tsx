import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { theToken } from "../../utils/constants";
import DataAssetCard from "../CardComponents/DataAssetCard";
import toast, { Toaster } from "react-hot-toast";

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
  ipnsKey: string;
}

type DataAsset = {
  fileName: string;
  id: string;
  cid: string;
  hash: string;
  mimeType: string;
};

export const DataAssetList: React.FC = () => {
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const { tokenLogin } = useGetLoginInfo();
  const [latestVersionCid, setLatestVersionCid] = useState<{ [key: string]: { version: number; hash: string } }>({});
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);

  // fetch all data assets of an address
  async function fetchAllDataAssetsOfAnAddress() {
    // const apiUrlGet = `${API_URL}/files_v2`;

    // try {
    //   const response = await axios.get(apiUrlGet, {
    //     headers: {
    //       "authorization": `Bearer ${theToken}`,
    //     },
    //   });

    //   setStoredDataAssets(response.data);
    // } catch (error) {
    //   console.error(error);
    //   throw error; // error to be catched by toast.promise
    // }
    const ipnsFiles = await getIpnsHashes();

    Object(ipnsFiles).map(async (item: any) => {
      console.log(item.key, item.pointingHash);
      try {
        const response = await getManifestFileFromIpnsHash(item.pointingHash);
        console.log("response of manifest : ", response.data);
        setManifestFiles((prev) => [...prev, { data_stream: response.data.data_stream, data: response.data.data, ipnsKey: item.key }] as ManifestFile[]);
      } catch (error) {
        console.error(error);
        throw error; // error to be caught by toast.promise
      }
    });
  }

  function getManifestFileFromIpnsHash(cid: string) {
    const apiUrlGetManifest = `${API_URL}/file_v2/` + cid;
    try {
      const response = axios.get(apiUrlGetManifest, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error; // error to be catched by toast.promise
    }
  }

  // get the latest version of the manifest file for each data asset
  function getManifestFilesFromDataAssets() {
    if (storedDataAssets) {
      const filteredData = storedDataAssets.filter((item) => item.fileName && item.fileName.includes("manifest"));

      let latestVersionManifestFile: { [key: string]: { version: number; hash: string } } = {};
      filteredData.forEach((item) => {
        const fileName = item.fileName.split(".-")[1]; //   filename format is "1.-manifest-name-creator"
        const version = parseInt(item.fileName.split(".-")[0]);
        if (!fileName) return;

        if (!latestVersionManifestFile[fileName] || version > latestVersionManifestFile[fileName].version) {
          latestVersionManifestFile[fileName] = {
            version: version,
            hash: item.hash,
          };
        }
      });
      setLatestVersionCid(latestVersionManifestFile);
    }
  }

  // download the manifest file for the coresponding CID
  async function downloadTheManifestFile(version: number, manifestCid: string) {
    const apiUrlDownloadFile = `${API_URL}/file_v2/` + manifestCid;

    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      const versionStampedManifestFile = { ...response.data, version: version };
      setManifestFiles((prev) => [...prev, versionStampedManifestFile]);
    } catch (error) {
      console.error("Error downloading manifest files:", error);
      toast.error("Error downloading manifest files. Check your connection and try again.");
    }
  }

  async function getIpnsHashes() {
    const apiUrlGetIpnsHashes = `${API_URL}/ipns/hashes`;
    try {
      const response = await axios.get(apiUrlGetIpnsHashes, {
        headers: {
          "authorization": `Bearer ${theToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // error to be catched by toast.promise
    }
  }

  useEffect(() => {
    if (storedDataAssets.length === 0) {
      toast.promise(fetchAllDataAssetsOfAnAddress(), {
        loading: "Fetching all data assets from Ipfs of your address...",
        success: <b>Fetched all data assets from Ipfs of your address!</b>,
        error: <b>The data assests could not be fetched. Check your connection and try again.</b>,
      });
    }
    //getIpnsHashes();
  }, []);

  // useEffect(() => {
  //   getManifestFilesFromDataAssets();
  // }, [storedDataAssets]);

  // useEffect(() => {
  //   if (Object.keys(latestVersionCid).length !== 0) {
  //     Object.entries(latestVersionCid).map(([key, manifestCid]) => {
  //       downloadTheManifestFile(manifestCid.version, manifestCid.hash);
  //     });
  //   }
  // }, [latestVersionCid]);

  return (
    <div className="p-4 flex flex-col ">
      <div className="bold text-xl text-foreground mb-16">Data assets</div>
      <div className="gap-4 grid grid-cols-3">
        {manifestFiles.map((manifest: ManifestFile, index) => (
          <Link
            key={index}
            to={"/upload"}
            state={{
              manifestFile: manifestFiles[index],
              action: "Update Data Asset",
              version: manifestFiles[index].version,
              ipnsKey: manifestFiles[index].ipnsKey,
            }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
