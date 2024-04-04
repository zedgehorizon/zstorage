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
};
