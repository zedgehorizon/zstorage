import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { API_URL } from "../../utils/constants";
import { theToken } from "../../utils/constants";
import DataAssetCard from "../CardComponents/DataAssetCard";
import toast from "react-hot-toast";
import { Lightbulb, Loader2 } from "lucide-react";

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
  manifestFileName: string;
  folderCid: string;
  cidv1: string;
}

type DataAsset = {
  fileName: string;
  id: string;
  folderCid: string;
  cid: string;
  cidv1: string;
  mimeType: string;
};

export const DataAssetList: React.FC = () => {
  const [storedDataAssets, setStoredDataAssets] = useState<DataAsset[]>([]);
  const { tokenLogin } = useGetLoginInfo();
  //const theToken = tokenLogin?.nativeAuthToken;
  const [manifestFiles, setManifestFiles] = useState<ManifestFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetch all data assets of an address
  async function fetchAllDataAssetsOfAnAddress() {
    const apiUrlGet = `${API_URL}/files`;
    setIsLoading(true);
    try {
      const response = await axios.get(apiUrlGet, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      setStoredDataAssets(response.data);
    } catch (error: any) {
      console.error("Eror fetching data assets", error);
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

  // download the manifest file for the coresponding CID
  async function downloadTheManifestFile(folderCid: string, manifestFileName: string, manifestCid: string) {
    const apiUrlDownloadFile = `${API_URL}/file/` + manifestCid;

    try {
      const response = await axios.get(apiUrlDownloadFile, {
        headers: {
          "authorization": `Bearer ${theToken}`,
        },
      });
      if (!response.data?.data_stream) {
        /// empty manifest file or wrong format should not happen only with older versions
        console.log("Manifest file is empty or wrong format", manifestCid);
        return undefined;
      }
      const versionStampedManifestFile = { ...response.data, manifestFileName: manifestFileName, cidv1: manifestCid, folderCid: folderCid };
      setManifestFiles((prev) => [...prev, versionStampedManifestFile]);
    } catch (error) {
      console.log("Error downloading manifest files:", manifestCid, error);
      toast("Wait some more time for the manifest file to get pinned if you can't find the one you are looking for", {
        icon: <Lightbulb color="yellow"></Lightbulb>,
        id: "fetch-manifest-file1",
      });
    }
  }

  useEffect(() => {
    if (storedDataAssets.length === 0) {
      /// think about is, what happens if the user has no data assets
      toast.promise(fetchAllDataAssetsOfAnAddress(), {
        loading: "Fetching all data assets from Ipfs of your address...",
        success: <b>Fetched all data assets from Ipfs of your address!</b>,
        error: <b>The data assests could not be fetched. </b>,
      });
    }
  }, []);

  useEffect(() => {
    const downloadLatestVersionsManifestFiles = async () => {
      await Promise.all(
        storedDataAssets.map(async (manifestAsset) => {
          await downloadTheManifestFile(manifestAsset.folderCid, manifestAsset.fileName, manifestAsset.cidv1);
        })
      );
      setIsLoading(false);
    };

    if (storedDataAssets.length > 0) {
      downloadLatestVersionsManifestFiles();
    }
  }, [storedDataAssets]);

  return (
    <div className="p-4 flex flex-col">
      {isLoading && (
        <div className="flex justify-center items-center -mt-4">
          <Loader2 color="blue-400" className="animate-spin rounded-full"></Loader2>
        </div>
      )}
      <div className="gap-4 grid grid-cols-3">
        {manifestFiles.map((manifest: ManifestFile, index) => (
          <Link
            key={index}
            to={"/upload"}
            state={{
              manifestFile: manifestFiles[index],
              action: "Update Data Asset",
              currentManifestFileCID: manifestFiles[index].cidv1,
              manifestFileName: manifestFiles[index].manifestFileName,
              folderCid: manifestFiles[index].folderCid,
            }}>
            <DataAssetCard dataAsset={manifest.data_stream}></DataAssetCard>
          </Link>
        ))}
      </div>
      {manifestFiles.length === 0 && !isLoading && (
        <div className="flex justify-center items-center">
          <p className="text-gray-400 text-2xl">No data assets found.</p>
        </div>
      )}
    </div>
  );
};
