import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_VERSION } from "../../../utils/constants";
import { tokenConstant } from "../../../utils/constants";
import DataAssetCard from "./DataAssetCard";
import toast from "react-hot-toast";
import { Lightbulb, Loader2 } from "lucide-react";
import { CATEGORIES } from "../../../utils/constants";
interface DataStream {
  name: string;
  category: string;
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
  manifestFileName: string;
  folderCid: string;
  cidv1: string;
  hash: string;
  folderHash: string;
}

type DataAsset = {
  fileName: string;
  id: string;
  folderCid: string;
  cid: string;
  cidv1: string;
  mimeType: string;
  hash: string;
  folderHash: string;
};

export const DataAssetList: React.FC = () => {
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const { tokenLogin } = useGetLoginInfo();
  const [showCategories, setShowCategories] = useState(false);
  const theToken = tokenConstant || tokenLogin?.nativeAuthToken;
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryManifestFiles, setCategoryManifestFiles] = useState<{ [key: string]: ManifestFile[] }>({
    [CATEGORIES[0]]: [],
    [CATEGORIES[1]]: [],
    [CATEGORIES[2]]: [],
  });

  // async function fetchAllDataAssetsOfAnAddressByCategory(category: string) {
  //   try {
  //     const apiUrlGet = `${import.meta.env.VITE_ENV_BACKEND_API}/files${API_VERSION}/${category}`;
  //     setIsLoading(true);

  //     const response = await axios.get(apiUrlGet, {
  //       headers: {
  //         "authorization": `Bearer ${theToken}`,
  //       },
  //     });

  //     setCategoryManifestFiles((prev) => ({ ...prev, [category]: response.data }));
  //   } catch (error: any) {
  //     console.error("Error fetching data assets", error);
  //   }
  // }

  // fetch all data assets of an address
  async function fetchAllManifestsOfAnAddress() {
    const apiUrlGet = `${import.meta.env.VITE_ENV_BACKEND_API}/files${API_VERSION}?manifest=true`;
    setIsLoading(true);
    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      setStoredDataAssets(response.data);
      if (response.data.length === 0) setIsLoading(false); // if no data assets, stop loading
    } catch (error: any) {
      console.error("Error fetching data assets", error);
      setIsLoading(false);

      if (error?.response.data.statusCode === 403) {
        toast("Native auth token expired. Re-login and try again! ", {
          icon: <Lightbulb color="yellow"></Lightbulb>,
        });
      } else {
        toast("Sorry, there’s a problem with the service, try again later " + `${error ? error.message + ". " + error?.response?.data.message : ""}`, {
          icon: <Lightbulb color="yellow"></Lightbulb>,
        });
      }
      throw error; // error to be caught by toast.promise
    }
  }

  async function fetchAllDataAssetsOfAnAddress() {
    await fetchAllManifestsOfAnAddress();

    // await fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[0]);
  }

  // download the manifest file for the corresponding CID
  async function downloadTheManifestFile(folder: string, manifestFileName: string, manifest: string) {
    const apiUrlDownloadFile = `${import.meta.env.VITE_ENV_BACKEND_API}/file${API_VERSION}/` + manifest;

    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      if (!response.data?.data_stream) {
        /// empty manifest file or wrong format should not happen only with older versions
        return undefined;
      }
      const versionStampedManifestFile = { ...response.data, manifestFileName: manifestFileName, hash: manifest, folderHash: folder };
      setManifestFiles((prev) => [...prev, versionStampedManifestFile]);
    } catch (error) {
      console.error("Error downloading manifest files:", manifest, error);
      toast("Wait some more time for the manifest file to get pinned if you can't find the one you are looking for", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
        id: "fetch-manifest-file1",
      });
    }
  }

  useEffect(() => {
    if (storedDataAssets.length === 0) {
      toast.promise(fetchAllDataAssetsOfAnAddress(), {
        loading: "Fetching all data assets from IPFS for your wallet...",
        success: <b>Fetched all data assets from IPFS for your wallet!</b>,
        error: <b>The data assets could not be fetched. </b>,
      });
    }
  }, []);

  useEffect(() => {
    let count = 0;
    if (isLoading === true) return;
    if (categoryManifestFiles[CATEGORIES[0]].length > 0) return;
    manifestFiles.map((manifest: ManifestFile, index) => {
      if (manifest.data_stream.category) {
        count += 1;
        setCategoryManifestFiles((prev) => ({
          ...prev,
          [manifest.data_stream.category]: Array.isArray(prev[manifest.data_stream.category]) ? [...prev[manifest.data_stream.category], manifest] : [manifest],
        }));
      }
    });
    setShowCategories(true);
  }, [isLoading]);

  useEffect(() => {
    const downloadLatestVersionsManifestFiles = async () => {
      try {
        await Promise.all(
          storedDataAssets.map(async (manifestAsset) => {
            await downloadTheManifestFile(manifestAsset.folderHash, manifestAsset.fileName, manifestAsset.hash);
          })
        );
      } catch (error) {
        throw error;
      }
      setIsLoading(false);
    };

    if (storedDataAssets.length > 0) {
      downloadLatestVersionsManifestFiles();
    }
  }, [storedDataAssets]);

  return (
    <div className="p-4 flex flex-col">
      {(isLoading && (
        <div className="flex justify-center items-center -mt-4">
          <Loader2 className="w-16 h-16 my-8 animate-spin text-accent"></Loader2>
        </div>
      )) || (
        <>
          <span className="text-accent text-2xl py-12">Your Folder / Files</span>
          {(categoryManifestFiles[CATEGORIES[0]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[0]].map((manifest: ManifestFile, index) => (
                  <Link
                    key={index}
                    to={"/upload"}
                    state={{
                      manifestFile: manifest,
                      action: "Update Asset",
                      currentManifestFileCID: manifest.hash,
                      manifestFileName: manifest.manifestFileName,
                      folderCid: manifest.folderHash,
                    }}>
                    <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
                  </Link>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl py-12">Your Music Data Streams </span>
          {(manifestFiles.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[1]].map((manifest: ManifestFile, index) => (
                  <Link
                    key={index}
                    to={"/upload-music"}
                    state={{
                      manifestFile: manifest,
                      action: "Update Asset",
                      currentManifestFileCID: manifest.hash,
                      manifestFileName: manifest.manifestFileName,
                      folderCid: manifest.folderHash,
                    }}>
                    <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
                  </Link>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl py-12">Your Trailblazer Data Streams </span>
          {(manifestFiles.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[2]].map((manifest: ManifestFile, index) => (
                  <Link
                    key={index}
                    to={"/upload-trailblazer"}
                    state={{
                      manifestFile: manifest,
                      action: "Update Asset",
                      currentManifestFileCID: manifest.hash,
                      manifestFileName: manifest.manifestFileName,
                      folderCid: manifest.folderHash,
                    }}>
                    <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
                  </Link>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
