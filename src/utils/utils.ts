import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString() {
  const timestampInSeconds = Math.floor(new Date().getTime() / 1000) % 100;
  console.log("timestampInSeconds", timestampInSeconds);
  const randomNum = Math.floor(Math.random() * 100);
  return `${timestampInSeconds}${randomNum}`;
}
