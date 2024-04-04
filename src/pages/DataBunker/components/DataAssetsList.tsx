import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_VERSION } from "@utils/constants";
import DataAssetCard from "./DataAssetCard";
import { toast } from "sonner";
import { Lightbulb, Loader2 } from "lucide-react";
import { CATEGORIES } from "@utils/constants";
import StaticDataAssetCard from "./StaticDataAssetCard";

export const DataAssetList: React.FC = () => {
  const { tokenLogin } = useGetLoginInfo();
  const [showCategories, setShowCategories] = useState(false);
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryManifestFiles, setCategoryManifestFiles] = useState<{ [key: string]: ManifestFile[] }>({
    [CATEGORIES[0]]: [],
    [CATEGORIES[1]]: [],
    [CATEGORIES[2]]: [],
  });
  const [staticDataAssets, setStaticDataAssets] = useState<StaticDataAsset[]>([]);

  useEffect(() => {
    toast.promise(fetchAllDataAssetsOfAnAddress(), {
      loading: "Fetching all your digital bunker data assets...",
      success: "Fetched all your digital bunker data assets!",
      error: "The data assets could not be fetched.",
    });
  }, []);

  // when we got all the manifest files, categorize them and then show the categories
  useEffect(() => {
    if (isLoading === true) return;
    manifestFiles.map((manifest: ManifestFile) => {
      if (manifest.data_stream.category) {
        setCategoryManifestFiles((prev) => ({
          ...prev,
          [manifest.data_stream.category]: Array.isArray(prev[manifest.data_stream.category]) ? [...prev[manifest.data_stream.category], manifest] : [manifest],
        }));
      }
    });
    setShowCategories(true);
  }, [isLoading]);

  // fetch all data assets of an address
  async function fetchAllManifestsOfAnAddress(): Promise<DataAsset[]> {
    const apiUrlGet = `${import.meta.env.VITE_ENV_BACKEND_API}/files${API_VERSION}?manifest=true`;
    setIsLoading(true);
    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data assets", error);
      setIsLoading(false);

      if (error?.response.data.statusCode === 403) {
        toast("Native auth token expired. Re-login and try again! ", {
          icon: <Lightbulb onClick={() => toast.dismiss()} color="yellow"></Lightbulb>,
        });
      } else {
        toast.error(
          "Sorry, there’s a problem with the service, please try again later! " + ` ${error ? error.message + ". " + error?.response?.data.message : ""}`
        );
      }

      throw error; // error to be caught by toast.promise
    }
  }

  async function fetchAllDataAssetsOfAnAddress() {
    const dataAssets: DataAsset[] = await fetchAllManifestsOfAnAddress();
    fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[3]);
    await downloadAllTheManifestFiles(dataAssets);
  }

  // download the manifest file for the corresponding CID
  async function downloadTheManifestFile(folderHash: string, manifestFileName: string, manifestCid: string, ipnsHash?: string, ipnsKey?: string) {
    const apiUrlDownloadFile = `${import.meta.env.VITE_ENV_BACKEND_API}/file${API_VERSION}/` + manifestCid;
    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
        },
      });
      if (!response.data?.data_stream) {
        /// empty manifest file or wrong format might happen only with older versions of manifest file

        console.error("empty manifest file or wrong format");
        return undefined;
      }
      const allDetailsStampedManifestFile = {
        ...response.data,
        manifestFileName: manifestFileName,
        hash: manifestCid,
        folderHash: folderHash,
        ipnsHash: ipnsHash,
        ipnsKey: ipnsKey,
      };
      setManifestFiles((prev) => [...prev, allDetailsStampedManifestFile]);
    } catch (error) {
      console.error("Error downloading manifest files:", manifestCid, error);
      toast("Wait some more time for the manifest file to get pinned if you can't find the one you are looking for", {
        icon: <Lightbulb onClick={() => toast.dismiss()} color="yellow"></Lightbulb>,
        id: "fetch-manifest-file1",
      });
    }
  }

  const downloadAllTheManifestFiles = async (storedDataAssets: DataAsset[]) => {
    if (storedDataAssets.length === 0) {
      setIsLoading(false); // if no data assets, stop loading
      toast.warning("No data assets found!");
      setIsLoading(false);
      return;
    }
    try {
      await Promise.all(
        storedDataAssets.map(async (manifestAsset) => {
          await downloadTheManifestFile(manifestAsset.folderHash, manifestAsset.fileName, manifestAsset.hash, manifestAsset.ipnsHash, manifestAsset.ipnsKey);
        })
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  async function fetchAllDataAssetsOfAnAddressByCategory(category: string) {
    try {
      const apiUrlGet = `${import.meta.env.VITE_ENV_BACKEND_API}/files${API_VERSION}/${category}`;
      setIsLoading(true);

      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
        },
      });
      console.log("response.data", response.data);
      const staticDataAssetsMap = response.data;

      const staticDataAssetsList: StaticDataAsset[] = Object.keys(staticDataAssetsMap).map((key) => {
        const array = staticDataAssetsMap[key];
        return array[0];
      });

      setStaticDataAssets(staticDataAssetsList);
    } catch (error: any) {
      console.error("Error fetching data assets", error);
    }
  }

  return (
    <div className="p-4 flex flex-col">
      {(isLoading && (
        <div className="flex justify-center items-center -mt-4">
          <Loader2 className="w-16 h-16 my-8 animate-spin text-accent"></Loader2>
        </div>
      )) || (
        <>
          <span className="text-accent text-2xl py-12">Static Files</span>
          {(staticDataAssets.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories && staticDataAssets.map((staticFile: StaticDataAsset, index) => <StaticDataAssetCard key={index} {...staticFile} />)}
            </div>
          )}

          <span className="text-accent text-2xl py-12">Dynamic Folders</span>
          {(categoryManifestFiles[CATEGORIES[0]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[0]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={0} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl py-12">Your Music Data Streams </span>
          {(categoryManifestFiles[CATEGORIES[1]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[1]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={1} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl py-12">Your Trailblazer Data Streams </span>
          {(categoryManifestFiles[CATEGORIES[2]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[2]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={2} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
