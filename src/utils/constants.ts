export const API_VERSION = "_v2"; // "_v2" for lighthouse ; "" for apillion
export const IPFS_GATEWAY = "https://gateway.lighthouse.storage/";
export const CATEGORIES = ["anyfile", "musicplaylist", "trailblazer", "staticdata"];
export const FILES_CATEGORY = "files";

export const ELROND_NETWORK = import.meta.env.VITE_ENV_NETWORK || "devnet";

export const whitelistMimeTypes: Whitelist = {
  // Images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  webp: "image/webp",
  tiff: "image/tiff",
  ico: "image/x-icon",

  // Videos
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",

  // Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  oggAudio: "audio/ogg",

  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  txt: "text/plain",
  csv: "text/csv",
  xml: "text/xml",
  json: "application/json",

  // Archives
  zip: "application/x-zip-compressed",
  tar: "application/x-tar",
  gzip: "application/gzip",
  rar: "application/vnd.rar",

  //website
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  jsx: "text/jsx",
  ts: "application/typescript",
  tsx: "text/tsx",
  php: "application/x-httpd-php",
  py: "text/x-python",
};

export enum AssetCategories {
  ANYFILE,
  MUSICPLAYLIST,
  TRALBLAZER,
  STATICDATA,
}
