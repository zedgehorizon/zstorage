import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_VERSION, SUI_WALRUS_PUBLISHER } from "./constants";
import axios from "axios";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString() {
  const timestampInSeconds = Math.floor(new Date().getTime() / 1000) % 100;
  const randomNum = Math.floor(Math.random() * 100);
  return `${timestampInSeconds}${randomNum}`;
}

export function onlyAlphaNumericChars(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + " ... " + value.slice(-length);
}

export async function uploadFilesRequest(filesToUpload: FormData, nativeAuthToken: string) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_ENV_BACKEND_API}/upload${API_VERSION}`, filesToUpload, {
      headers: {
        "authorization": `Bearer ${nativeAuthToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading files:", error);

    if (error?.response.data.statusCode === 403) {
      toast("Native auth token expired. Re-login and try again!");
    } else if (error?.response.data.statusCode === 402) {
      toast("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue.");
    } else toast.error("Error uploading files to your data bunker: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
    return error;
  }
}

export async function uploadFilesRequestSUIWalrus(filesToUpload: FormData, nativeAuthToken: string) {
  try {
    /*
    We should move this logic to a custom upload endpoint for SUI Walrus which measures storage and the SUI lifecycle
    for now we do the logic locally and return a mock payload as per backend format so it all works
    [
      {
        "hash":"bafkreifpgi3zzu6yupahgw2is7zrj455wdzzkbkyg327anjq4z7jomz754",
        "fileName":"18761.image_S1.jpg",
        "mimeType":"image/jpeg",
        "address":"erd1eweqykxcrhh5nps4fzktu9eftf7rxpa8xdfkypwz0k4huhl0s04sa6tqyd",
        "size":51807,
        "folderHash":"bafybeicxjcj2dowmzuy22zmnm7iwfrc3jpogiz6hcox57fnxrkaucndwti",
        "timestamp":1726360742,
        "category":"files",
        "uuid":1736},
        {
          "hash":"bafkreigmy72q46w4gys5s6feqn3g7zaolr7gu5gorwmsz4j3ntz42dtqn4",
          "fileName":"23711.audio_S1.mp3",
          "mimeType":"audio/mpeg",
          "address":"erd1eweqykxcrhh5nps4fzktu9eftf7rxpa8xdfkypwz0k4huhl0s04sa6tqyd",
          "size":103070,
          "folderHash":"bafybeicxjcj2dowmzuy22zmnm7iwfrc3jpogiz6hcox57fnxrkaucndwti",
          "timestamp":1726360743,
          "category":"files",
          "uuid":1737
        }
      ]
    */

    // iterate the FormData in filesToUpload and store each File into storeBlobSUIWalrus and store each response
    const apiCompatibleObjs: any[] = [];

    for (const fileObj of filesToUpload.values()) {
      if (fileObj instanceof File) {
        if (fileObj?.name && fileObj?.type) {
          const nowTS = Date.now();

          const apiCompatibleObj = {
            "isSuiWalrus": 1,
            "hash": "",
            "fileName": fileObj.name,
            "mimeType": fileObj.type,
            "address": "",
            "size": 0,
            "folderHash": "",
            "timestamp": nowTS,
            "category": "files",
            "uuid": nowTS,
          };

          const storageInfo = await storeBlobSUIWalrus(fileObj);
          const storage_info = storageInfo.info;
          const media_type = storageInfo.media_type;

          if ("alreadyCertified" in storage_info) {
            apiCompatibleObj.hash = storage_info.alreadyCertified.blobId;
            apiCompatibleObj.mimeType = media_type;
            // info = {
            //   status: "Already certified",
            //   blobId: storage_info.alreadyCertified.blobId,
            //   endEpoch: storage_info.alreadyCertified.endEpoch,
            //   suiRefType: "Previous Sui Certified Event",
            //   suiRef: storage_info.alreadyCertified.event.txDigest,
            //   suiBaseUrl: SUI_VIEW_TX_URL,
            // };
          } else if ("newlyCreated" in storage_info) {
            apiCompatibleObj.hash = storage_info.newlyCreated.blobObject.blobId;
            apiCompatibleObj.mimeType = media_type;
            // info = {
            //   status: "Newly created",
            //   blobId: storage_info.newlyCreated.blobObject.blobId,
            //   endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
            //   suiRefType: "Associated Sui Object",
            //   suiRef: storage_info.newlyCreated.blobObject.id,
            //   suiBaseUrl: SUI_VIEW_OBJECT_URL,
            // };
          } else {
            throw Error("Unhandled SUI Walrus successful response!");
          }

          apiCompatibleObjs.push(apiCompatibleObj);
        }
      }
    }

    return apiCompatibleObjs;
  } catch (error: any) {
    console.error("Error uploading files:", error);

    if (error?.response.data.statusCode === 403) {
      toast("Native auth token expired. Re-login and try again!");
    } else if (error?.response.data.statusCode === 402) {
      toast("You have exceeded your 10MB free tier usage limit. A paid plan is required to continue.");
    } else toast.error("Error uploading files to your data bunker: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
    return error;
  }
}

async function storeBlobSUIWalrus(inputFile: any) {
  const numEpochs = "1";

  // Submit a PUT request with the file's content as the body to the /v1/store endpoint.
  return fetch(`${SUI_WALRUS_PUBLISHER}/v1/store?epochs=${numEpochs}`, {
    method: "PUT",
    body: inputFile,
  }).then((response) => {
    if (response.status === 200) {
      // Parse successful responses as JSON, and return it along with the
      // mime type from the the file input element.
      return response.json().then((info) => {
        console.log(info);
        return { info: info, media_type: inputFile.type };
      });
    } else {
      toast.error("Something went wrong when storing the Walrus blob!");
      throw new Error("Something went wrong when storing the Walrus blob!");
    }
  });
}

export async function getUserAvailableSpace(nativeAuthToken: string) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_ENV_BACKEND_API}/account`, {
      headers: {
        "authorization": `Bearer ${nativeAuthToken}`,
      },
    });
    return Number(response.data.maxSize) - response.data.size;
  } catch (error: any) {
    if (error?.response.data.statusCode === 403) {
      toast("Fetching the available space failed.Native auth token expired. Re-login and try again!");
    } else toast.warning("Error while fetching the available space: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
    return -1;
  }
}

export async function publishIpns(nativeAuthToken: string, pointingToManifestCid: string, ipnsKey?: string) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_ENV_BACKEND_API}/ipns/publish`, {
      params: { cid: pointingToManifestCid, key: ipnsKey ? ipnsKey : undefined },
      headers: {
        "authorization": `Bearer ${nativeAuthToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading files:", error);
    if (error?.response.data.statusCode === 403) {
      toast("Native auth token expired. Re-login and try again! ");
    }
    toast.error("Error uploading files to your data bunker: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
  }
}

export function isRunningLowOnSpace(availableSpaceToUpload: any) {
  // less than 2 MB is low space
  if (availableSpaceToUpload && availableSpaceToUpload >= 0 && availableSpaceToUpload / 1024 ** 2 < 3) {
    return true;
  } else {
    return false;
  }
}
