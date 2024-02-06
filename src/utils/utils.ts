import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_VERSION } from "./constants";
import axios from "axios";

import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString() {
  const timestampInSeconds = Math.floor(new Date().getTime() / 1000) % 100;
  const randomNum = Math.floor(Math.random() * 100);
  return `${timestampInSeconds}${randomNum}`;
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
      toast("Native auth token expired. Re-login and try again! ");
    }
    toast.error("Error uploading files to Ipfs: " + `${error ? error.message + ". " + error?.response?.data.message : ""}`);
  }
}
