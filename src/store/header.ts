import { create } from "zustand";

type State = {
  name: string;
  creator: string;
  modifiedOn: string;
  createdOn: string;
  stream: boolean;
  maxSpace: number;
  maxBandwidth: number;
  availableSpaceToUpload: number;
  availableBandwidthToUpload: number;
  accountTier: string;
};

type Action = {
  updateName: (name: State["name"]) => void;
  updateCreator: (creator: State["creator"]) => void;
  updateModifiedOn: (creator: State["modifiedOn"]) => void;
  updateCreatedOn: (creator: State["createdOn"]) => void;
  updateStream: (creator: State["stream"]) => void;
  updateAvailableSpaceToUpload: (availableSpaceToUpload: State["availableSpaceToUpload"]) => void;
  updateMaxSpace: (maxSpace: State["maxSpace"]) => void;
  updateAvailableBandwidth: (availableBandwidthToUpload: State["availableBandwidthToUpload"]) => void;
  updateMaxBandwidth: (maxBandwidth: State["maxBandwidth"]) => void;
  updateAccountTier: (accountTier: State["accountTier"]) => void;
};

export const useHeaderStore = create<State & Action>((set) => ({
  name: "",
  creator: "",
  modifiedOn: new Date().toISOString().split("T")[0],
  createdOn: new Date().toISOString().split("T")[0],
  stream: true,
  maxSpace: -1,
  availableSpaceToUpload: -1,
  maxBandwidth: -1,
  availableBandwidthToUpload: -1,
  accountTier: "",

  updateName: (value: string) => set(() => ({ name: value })),
  updateCreator: (value: string) => set(() => ({ creator: value })),
  updateModifiedOn: (value: string) => set(() => ({ modifiedOn: value })),
  updateCreatedOn: (value: string) => set(() => ({ createdOn: value })),
  updateStream: (value: boolean) => set(() => ({ stream: value })),
  updateMaxSpace: (value: number) => set(() => ({ maxSpace: value })),
  updateAvailableSpaceToUpload: (value: number) => set(() => ({ availableSpaceToUpload: value })),
  updateMaxBandwidth: (value: number) => set(() => ({ maxBandwidth: value })),
  updateAvailableBandwidth: (value: number) => set(() => ({ availableBandwidthToUpload: value })),
  updateAccountTier: (value: string) => set(() => ({ accountTier: value })),
}));
