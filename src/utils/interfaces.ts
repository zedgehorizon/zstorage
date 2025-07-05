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

type StaticDataAsset = {
  address: string;
  category: string;
  fileName: string;
  folderHash: string;
  hash: string;
  mimeType: string;
  size: number;
  timestamp: number;
  uuid: number;
  id?: string;
  blobId?: string;
};
/*
  {
    "uuid": "string",
    "hash": "string",
    "fileName": "string",
    "mimeType": "string",
    "address": "string",
    "size": 0,
    "folderHash": "string",
    "timestamp": 0,
    "category": "string"
  }
{
    "id": "file-id-123",
    "blobId": "blob-456",
    "address": "erd1...",
    "fileName": "myfile.png",
    "mimeType": "image/png",
    "size": 12345,
    "timestamp": 1680000000,
    "category": "music-data-nft"
  }

*/

type MetaPairDataAsset = {
  address: string;
  category: string;
  fileName: string;
  folderHash: string;
  hash: string;
  mimeType: string;
  size: number;
  timestamp: number;
  uuid: number;
};

type MetaPairJsonFile = {
  json: MetaPairDataAsset | null;
};

interface Whitelist {
  [extension: string]: string;
}
