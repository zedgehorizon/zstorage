import { DataNft } from "@itheum/sdk-mx-data-nft";

// You have to generate your projectId using https://cloud.walletconnect.com/ website
export const walletConnectV2ProjectId = "";

export const apiTimeout = 6000;

// set network config of DataNft class
DataNft.setNetworkConfig("devnet");
