import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_VERSION } from "./constants";
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
