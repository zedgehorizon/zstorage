import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { theToken } from "../../utils/constants";
import DataAssetCard from "../CardComponents/DataAssetCard";
import toast from "react-hot-toast";
import { Lightbulb } from "lucide-react";

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
  cidv1: string;
  ipnsKey: string;
}

type DataAsset = {
  fileName: string;
  id: string;
  cid: string;
  cidv1: string;
  hash: string;
  mimeType: string;
};
/// todo check why some of the manifest files are not downloaded and show the bad manifest
export const DataAssetList: React.FC = () => {
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const [storedDataAssetsLightHouse, setStoredDataAssetsLightHouse] = useState<DataAsset[]>([]);

  const { tokenLogin } = useGetLoginInfo();
  const [latestVersionCid, setLatestVersionCid] = useState<{ [key: string]: { version: number; cidv1: string } }>({});
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [manifestFilesLighthouse, setManifestFilesLighthouse] = useState<ManifestFile[]>([]);

  // fetch all data assets of an address
  async function fetchAllDataAssetsOfAnAddress() {
    const apiUrlGet = `${API_URL}/files`;

    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      setStoredDataAssets(response.data);
    } catch (error: any) {
      console.error("Eror fetching data assets", error.code, error.message);
      if (error?.response.data.statusCode === 403) {
        toast("Native auth token expired. Re-login and try again! ", {
          icon: <Lightbulb color="yellow"></Lightbulb>,
        });
      } else {
        toast("Sorry, there’s a problem with the service, try again later " + `${error ? error.message + ". " + error?.response?.data.message : ""}`, {
          icon: <Lightbulb color="yellow"></Lightbulb>,
        });
      }
      throw error; // error to be catched by toast.promise
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

      console.log("response ipnsHashes : ", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // error to be catched by toast.promise
    }
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

  async function fetchAllDataAssetsFromLighthouse() {
    const ipnsFiles = await getIpnsHashes();

    Object(ipnsFiles).map(async (item: any) => {
      try {
        const response = await getManifestFileFromIpnsHash(item.pointingHash);
        //console.log("response of manifest : ", response.data);
        setManifestFilesLighthouse(
          (prev) =>
            [...prev, { data_stream: response.data.data_stream, data: response.data.data, ipnsKey: item.key, cidv1: item.pointingHash }] as ManifestFile[]
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  }

  // get the latest version of the manifest file for each data asset
  function getManifestFilesFromDataAssets() {
    if (storedDataAssets) {
      const filteredData = storedDataAssets.filter((item) => item.fileName && item.fileName.includes("manifest"));

      let latestVersionManifestFile: { [key: string]: { version: number; cidv1: string } } = {};
      filteredData.forEach((item) => {
        const fileName = item.fileName.split(".-")[1].split("|")[0]; //   filename format is "1.-manifest-name-creator|random-.json"

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
      if (!response.data?.data_stream) {
        /// empty manifest file or wrong format
        return undefined;
      }
      const versionStampedManifestFile = { ...response.data, version: version, cidv1: manifestCid };
      setManifestFiles((prev) => [...prev, versionStampedManifestFile]);
    } catch (error) {
      console.log("Error downloading manifest files:", error);
      //toast.error("Error downloading manifest files. Check your connection and try again. " + (error as Error).message, { id: "fetch-manifest-file" });
      toast("Wait some more time for the manifest file to get pinned if you can't find the one you are looking for", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
        id: "fetch-manifest-file1",
      });
    }
  }

  useEffect(() => {
    if (storedDataAssets.length === 0) {
      toast.promise(fetchAllDataAssetsOfAnAddress(), {
        loading: "Fetching all data assets from Ipfs of your address...",
        success: <b>Fetched all data assets from Ipfs of your address!</b>,
        error: <b>The data assests could not be fetched. </b>,
      });
    }
    if (storedDataAssetsLightHouse.length === 0) {
      toast.promise(fetchAllDataAssetsFromLighthouse(), {
        loading: "Fetching all data assets from Lighthouse...",
        success: <b>Fetched all data assets from Lighthouse!</b>,
        error: <b>The data assests from Lighthouse could not be fetched. </b>,
      });
    }
  }, []);

  useEffect(() => {
    getManifestFilesFromDataAssets();
  }, [storedDataAssets]);

  useEffect(() => {
    const downloadLatestVersionsManifestFiles = async () => {
      if (Object.keys(latestVersionCid).length !== 0) {
        Object.entries(latestVersionCid).map(([key, manifestCid]) => {
          downloadTheManifestFile(manifestCid.version, manifestCid.cidv1);
        });
      }
    };
    downloadLatestVersionsManifestFiles();
  }, [latestVersionCid]);

  return (
    <div className="p-4 flex flex-col">
      <div className="bold text-xl text-foreground my-16">Data assets from Light House</div>
      <div className="gap-4 grid grid-cols-3">
        {manifestFilesLighthouse.map((manifest: ManifestFile, index) => (
          <Link
            key={index}
            to={"/upload"}
            state={{
              manifestFile: manifestFilesLighthouse[index],
              action: "Update Data Asset",
              version: manifestFilesLighthouse[index].version,
              ipnsKey: manifestFilesLighthouse[index].ipnsKey,
              currentManifestFileCID: manifestFilesLighthouse[index].cidv1,
            }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
      <div className="bold text-xl text-foreground my-16">Data assets from Ipfs</div>
      <div className="gap-4 grid grid-cols-3">
        {manifestFiles.map((manifest: ManifestFile, index) => (
          <Link
            key={index}
            to={"/upload"}
            state={{
              manifestFile: manifestFiles[index],
              action: "Update Data Asset",
              version: manifestFiles[index].version,
              currentManifestFileCID: manifestFiles[index].cidv1,
            }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
