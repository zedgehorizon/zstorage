import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_VERSION } from "../../../utils/constants";
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
  manifestFileName: string;
  folderCid: string;
  hash: string;
  folderHash: string;
  ipnsHash?: string;
  ipnsKey?: string;
}

type DataAsset = {
  fileName: string;
  id: string;
  folderCid: string;
  cid: string;
  mimeType: string;
  hash: string;
  folderHash: string;
  ipnsHash?: string;
  ipnsKey?: string;
};

type IpnsResponseStruct = {
  key: string;
  hash: string;
  address: string;
  pointingHash: string;
  lastUpdated: string;
};

export const DataAssetList: React.FC = () => {
  const [ipnsResponse, setIpnsResponse] = useState<IpnsResponseStruct[]>([]);
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const { tokenLogin } = useGetLoginInfo();
  const [showCategories, setShowCategories] = useState(false);
  const theToken = tokenLogin?.nativeAuthToken;
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ipnsIsLoading, setIpnsIsLoading] = useState(true);

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

  // fetch all ipns keys of an address
  async function fetchAllIpnsKeysOfAnAddress() {
    const apiUrlGetIpns = `${import.meta.env.VITE_ENV_BACKEND_API}/ipns/hashes`;

    try {
      const response = await axios.get(apiUrlGetIpns, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });

      // if (response.data.length === 0) setIsLoading(false);
      // // if no data assets, stop loading
      console.log(response.data, "ipnsResponse");

      setIpnsResponse(response.data);
    } catch (error: any) {
      console.error("Error fetching ipns data assets", error);
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

  /// download the manifest file of the pointingCid of each ipns key
  useEffect(() => {
    const downloadManifestFilesFromIpns = async () => {
      try {
        await Promise.all(
          ipnsResponse.map((ipnsObject: IpnsResponseStruct) => {
            downloadTheManifestFile(undefined, undefined, ipnsObject.pointingHash, ipnsObject.hash, ipnsObject.key);
          })
        );
        setIpnsIsLoading(false);
      } catch (error) {
        throw error;
      }
      //setIsLoading(false);
    };
    if (ipnsResponse.length > 0) {
      console.log("downloading manifest from ipns ");
      downloadManifestFilesFromIpns();
    }
    if (ipnsResponse.length === 0) return;
    ipnsResponse.map((ipns: IpnsResponseStruct) => {
      downloadTheManifestFile(ipns.hash, ipns.key, ipns.pointingHash, ipns.hash, ipns.key);
    });
  }, [ipnsResponse]);

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
      console.log(response.data, "DATA ASSSETS");
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
      throw error; //error to be caught by toast.promise
    }
  }

  async function fetchAllDataAssetsOfAnAddress() {
    await fetchAllIpnsKeysOfAnAddress();
    await fetchAllManifestsOfAnAddress();
    // await fetchAllDataAssetsOfAnAddressByCategory(CATEGORIES[0]);
  }

  //download the manifest file for the corresponding CID
  async function downloadTheManifestFile(
    folderHash: string | undefined,
    manifestFileName: string | undefined,
    manifestCid: string,
    ipnsHash?: string,
    ipnsKey?: string
  ) {
    const apiUrlDownloadFile = `${import.meta.env.VITE_ENV_BACKEND_API}/file${API_VERSION}/` + manifestCid;
    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      if (!response.data?.data_stream) {
        console.error("error undefined");
        /// empty manifest file or wrong format might happen only with older versions of manifest file
        return undefined;
      }

      const allDetailsStampedManifestFile = {
        ...response.data,
        manifestFileName: manifestFileName,
        hash: manifestCid,
        folderCid: folderHash,
        ipnsHash: ipnsHash,
        ipnsKey: ipnsKey,
      };
      console.log("all DEtails", allDetailsStampedManifestFile);

      if (!(folderHash || manifestFileName)) {
        const index: number = manifestFiles.findIndex((manifestFile) => manifestFile.hash === allDetailsStampedManifestFile.hash);
        console.log("mathching ", index);
        if (index != -1 && ipnsKey && ipnsHash) handleManifestUpdateWithIpnsInformationFromIndex(index, ipnsKey, ipnsHash);
        else setManifestFiles((prev) => [...prev, allDetailsStampedManifestFile]);
      } else {
        setManifestFiles((prev) => [...prev, allDetailsStampedManifestFile]);
      }
    } catch (error) {
      console.error("Error downloading manifest files:", manifestCid, error);
      toast("Wait some more time for the manifest file to get pinned and try again if you can't find the one you are looking for", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
        id: "fetch-manifest-file1",
      });
    }
  }
  function handleManifestUpdateWithIpnsInformationFromIndex(index: number, ipnsKey: string, ipnsHash: string) {
    let items: ManifestFile[] = [...manifestFiles];
    let item = { ...items[index] };
    item.ipnsKey = ipnsKey;
    item.ipnsHash = ipnsHash;
    items[index] = item;
    setManifestFiles(items);
  }
  useEffect(() => {
    if (storedDataAssets.length === 0) {
      toast.promise(fetchAllDataAssetsOfAnAddress(), {
        loading: "Fetching all your digital bunker data assets...",
        success: <b>Fetched all your digital bunker data assets!</b>,
        error: <b>The data assets could not be fetched. </b>,
      });
    }
  }, []);

  useEffect(() => {
    if (isLoading === true || ipnsIsLoading === true) return;
    // if (categoryManifestFiles[CATEGORIES[0]].length > 0) return;    TODO check why I placed this here?
    manifestFiles.map((manifest: ManifestFile) => {
      if (manifest.data_stream.category) {
        setCategoryManifestFiles((prev) => ({
          ...prev,
          [manifest.data_stream.category]: Array.isArray(prev[manifest.data_stream.category]) ? [...prev[manifest.data_stream.category], manifest] : [manifest],
        }));
      }
    });
    setShowCategories(true);
  }, [isLoading, ipnsIsLoading]);

  useEffect(() => {
    const downloadAllTheManifestFiles = async () => {
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
      downloadAllTheManifestFiles();
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
            <div className="gap-4 grid grid-cols-3">
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
            <div className="gap-4 grid grid-cols-3">
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
