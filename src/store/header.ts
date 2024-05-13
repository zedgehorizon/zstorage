import { create } from "zustand";

type State = {
  name: string;
  creator: string;
  modifiedOn: string;
  createdOn: string;
  stream: boolean;
  availableSpaceToUpload: number;
};

type Action = {
  updateName: (name: State["name"]) => void;
  updateCreator: (creator: State["creator"]) => void;
  updateModifiedOn: (creator: State["modifiedOn"]) => void;
  updateCreatedOn: (creator: State["createdOn"]) => void;
  updateStream: (creator: State["stream"]) => void;
  updateAvailableSpaceToUpload: (availableSpaceToUpload: State["availableSpaceToUpload"]) => void;
};

export const useHeaderStore = create<State & Action>((set) => ({
  name: "",
  creator: "",
  modifiedOn: new Date().toISOString().split("T")[0],
  createdOn: new Date().toISOString().split("T")[0],
  stream: true,
  availableSpaceToUpload: -1,

  updateName: (value: string) => set(() => ({ name: value })),
  updateCreator: (value: string) => set(() => ({ creator: value })),
  updateModifiedOn: (value: string) => set(() => ({ modifiedOn: value })),
  updateCreatedOn: (value: string) => set(() => ({ createdOn: value })),
  updateStream: (value: boolean) => set(() => ({ stream: value })),
  updateAvailableSpaceToUpload: (value: number) => set(() => ({ availableSpaceToUpload: value })),
}));
