import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_VERSION, AssetCategories } from "@utils/constants";
import DataAssetCard from "./DataAssetCard";
import { toast } from "sonner";
import { Lightbulb, Loader2 } from "lucide-react";
import { CATEGORIES } from "@utils/constants";
import StaticDataAssetCard from "./StaticDataAssetCard";
import MetaPairDataAssetCard from "./MetaPairDataAssetCard";

export const DataAssetList: React.FC = () => {
  const { tokenLogin } = useGetLoginInfo();
  const [showCategories, setShowCategories] = useState(false);
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryManifestFiles, setCategoryManifestFiles] = useState<{ [key: string]: ManifestFile[] }>({
    [CATEGORIES[AssetCategories.ANYFILE]]: [],
    [CATEGORIES[AssetCategories.MUSICPLAYLIST]]: [],
    [CATEGORIES[AssetCategories.TRALBLAZER]]: [],
  });
  const [staticDataAssets, setStaticDataAssets] = useState<StaticDataAsset[]>([]);
  const [dataTokenMetaPairAssets, setDataTokenMetaPairAssets] = useState<MetaPairJsonFile[]>([]);

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
          "Sorry, there's a problem with the service, please try again later! " + ` ${error ? error.message + ". " + error?.response?.data.message : ""}`
        );
      }

      throw error; // error to be caught by toast.promise
    }
  }

  async function fetchAllDataAssetsOfAnAddress() {
    const dataAssets: DataAsset[] = await fetchAllManifestsOfAnAddress();

    // S: fetch all static data assets
    // ipfs assets will return as objects, where the folderHash is the key
    const staticDataAssetsFromBackend = await fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[AssetCategories.STATICDATA]);

    // walrus assets will return as an array of direct files as there are no folders used in walrus
    const staticDataAssetsFromBackendWalrus = await fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[AssetCategories.STATICDATA], true);

    const staticDataAssetsList: StaticDataAsset[] = [
      ...Object.keys(staticDataAssetsFromBackend).map((key) => {
        const array = staticDataAssetsFromBackend[key];
        return array[0];
      }),
      ...staticDataAssetsFromBackendWalrus,
    ];

    console.log("staticDataAssetsList", staticDataAssetsList);

    setStaticDataAssets(staticDataAssetsList);

    // E: fetch all static data assets

    // fetch all data token meta pair assets
    const dataTokenMetaPairAssetsFromBackend = await fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[AssetCategories.DATATOKEN_METAPAIR]);

    // we are only interested in the JSON file as that holds the absolute path for the image file (which is in a seperate folder)
    // ... as it needs to be up seperate to the JSON file to be able to be referenced in the JSON file
    // ... so if we dont filer the JSON files, we will also get the image files (in a seperate folder) which is not what we want
    // ... in future, if we really want we can always write the code to join the image and json files together
    const filteredDataTokenMetaPairAssetsFromBackend: MetaPairJsonFile[] = Object.keys(dataTokenMetaPairAssetsFromBackend).map((key) => {
      try {
        const array = dataTokenMetaPairAssetsFromBackend[key];

        if (!array || !Array.isArray(array)) {
          console.warn(`Invalid array structure for key ${key}:`, array);
          return { json: null };
        }

        if (array[0]?.mimeType === "application/json") {
          return { json: array[0] };
        } else if (array[1]?.mimeType === "application/json") {
          return { json: array[1] };
        } else {
          console.warn(`No JSON file found in array for key ${key}:`, array);
          return { json: null };
        }
      } catch (error) {
        console.error(`Error processing key ${key}:`, error);
        return { json: null };
      }
    });

    setDataTokenMetaPairAssets(filteredDataTokenMetaPairAssetsFromBackend);

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
        // empty manifest file or wrong format might happen only with older versions of manifest file
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

  async function fetchAllDataAssetsOfAnAddressByCategory(category: string, isWalrus: boolean = false) {
    try {
      if (!isWalrus) {
        // get all non-walrus data assets
        const apiUrlGet = `${import.meta.env.VITE_ENV_BACKEND_API}/files${API_VERSION}/${category}`;
        const response = await axios.get(apiUrlGet, {
          headers: {
            "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
          },
        });
        return response.data;
      } else {
        // get all walrus data assets
        const apiUrlGetWalrus = `${import.meta.env.VITE_ENV_BACKEND_API}/walrus/files/${category}`;
        const responseWalrus = await axios.get(apiUrlGetWalrus, {
          headers: {
            "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
          },
        });
        return responseWalrus.data;
      }
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
          <span className="text-accent text-2xl py-6">Data Token JSON Metadata Files</span>
          {(dataTokenMetaPairAssets.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                dataTokenMetaPairAssets.map((dataTokenMetaPairAsset: MetaPairJsonFile, index) => (
                  <MetaPairDataAssetCard key={index} json={dataTokenMetaPairAsset.json} />
                ))}
            </div>
          )}

          <span className="text-accent text-2xl pt-12 pb-6">Static Files</span>
          {(staticDataAssets.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories && staticDataAssets.map((staticFile: StaticDataAsset, index) => <StaticDataAssetCard key={index} {...staticFile} />)}
            </div>
          )}

          <span className="text-accent text-2xl pt-12 pb-6">Dynamic Folders</span>
          {(categoryManifestFiles[CATEGORIES[AssetCategories.ANYFILE]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[AssetCategories.ANYFILE]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={AssetCategories.ANYFILE} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl pt-12 pb-6">Your Music Data Streams </span>
          {(categoryManifestFiles[CATEGORIES[AssetCategories.MUSICPLAYLIST]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[AssetCategories.MUSICPLAYLIST]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={AssetCategories.MUSICPLAYLIST} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}

          <span className="text-accent text-2xl pt-12 pb-6">Your Time Capsule Data Streams </span>
          {(categoryManifestFiles[CATEGORIES[AssetCategories.TRALBLAZER]].length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-gray-400 text-2xl">No assets found</p>
            </div>
          )) || (
            <div className="gap-4 grid lg:grid-cols-3">
              {showCategories &&
                categoryManifestFiles[CATEGORIES[AssetCategories.TRALBLAZER]].map((manifest: ManifestFile, index) => (
                  <DataAssetCard key={index} category={AssetCategories.TRALBLAZER} manifest={manifest}></DataAssetCard>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
