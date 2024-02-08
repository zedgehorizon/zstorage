import React from "react";
import "./App.css";
import { AuthenticatedRoutesWrapper, DappProvider } from "@multiversx/sdk-dapp/wrappers";
import { NotificationModal, SignTransactionsModals, TransactionsToastList } from "@multiversx/sdk-dapp/UI";
import { apiTimeout, walletConnectV2ProjectId } from "./config";
import { Navbar } from "./components/Layout/Navbar";
import { Route, Routes } from "react-router-dom";
import { Start } from "./pages/Start/Start";
import { Content } from "./components/Layout/Content";
import { Unlock } from "./pages/Unlock/Unlock";
import { UploadMusicData } from "./pages/Upload/UploadMusicDataNft";
import { UploadTrailblazerData } from "./pages/Upload/UploadTrailblazerData";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import StoreDataAsset from "./pages/StoreDataAsset.tsx/StoreDataAssetPage";
import DataBunker from "./pages/DataBunker/DataBunker";
import UploadAnyFiles from "./pages/Upload/UploadAnyFiles";
import CampaignPage from "./pages/CampaignPage/CampaignPage";
import { ELROND_NETWORK } from "./utils/constants";

const routes = [
  {
    path: "/",
    title: "Home",
    component: LandingPage,
    authenticatedRoute: false,
  },
  {
    path: "/upload",
    title: "Upload Files",
    component: UploadAnyFiles,
    authenticatedRoute: true,
  },
  {
    path: "/upload-music",
    title: "Upload Music Data NFT Stream",
    component: UploadMusicData,
    authenticatedRoute: true,
  },
  {
    path: "/upload-trailblazer",
    title: "Upload Trailblazer Data NFT Stream",
    component: UploadTrailblazerData,
    authenticatedRoute: true,
  },
  {
    path: "/data-bunker",
    title: "Data Bunker",
    component: DataBunker,
    authenticatedRoute: true,
  },
  {
    path: "/unlock",
    title: "Unlock",
    component: Unlock,
    authenticatedRoute: false,
  },

  {
    path: "/start",
    title: "Start",
    component: Start,
    authenticatedRoute: true,
  },
  {
    path: "/storage",
    title: "Store Data Asset",
    component: StoreDataAsset,
    authenticatedRoute: true,
  },
  {
    path: "/itheum-music-data-nft",
    title: "Itheum Music Data NFT",
    component: CampaignPage,
    authenticatedRoute: false,
  },
];

function App() {
  return (
    <DappProvider
      environment={ELROND_NETWORK}
      customNetworkConfig={{
        name: "customConfig",
        apiTimeout,
        walletConnectV2ProjectId,
      }}>
      <TransactionsToastList successfulToastLifetime={1000} customToastClassName="absolute" />
      <NotificationModal />
      <SignTransactionsModals className="custom-class-for-modals" />
      <div className="">
        <div className="flex flex-col min-h-[100svh] text-white backdrop-blur-xl">
          <Toaster
            position="top-right"
            reverseOrder={false}
            containerStyle={{
              position: "sticky",
              zIndex: 9999,
              width: "100%",
            }}
            toastOptions={{
              className: "",
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
              },
            }}
          />
          <Navbar />
          <Content>
            <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
              <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/start" element={<Start />}></Route>
                <Route path="/unlock" element={<Unlock />}></Route>
                <Route path="/upload-music" element={<UploadMusicData />}></Route>
                <Route path="/upload-trailblazer" element={<UploadTrailblazerData />}></Route>
                <Route path="/upload" element={<UploadAnyFiles />}></Route>
                <Route path="/data-bunker" element={<DataBunker />}></Route>
                <Route path="/storage" element={<StoreDataAsset />}></Route>
                <Route path="/itheum-music-data-nft" element={<CampaignPage />}></Route>
              </Routes>
            </AuthenticatedRoutesWrapper>
          </Content>
        </div>
      </div>
    </DappProvider>
  );
}

export default App;
