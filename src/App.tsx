import React, { useEffect } from "react";
import "./App.css";
import { AuthenticatedRoutesWrapper, DappProvider } from "@multiversx/sdk-dapp/wrappers";
import { NotificationModal, SignTransactionsModals, TransactionsToastList } from "@multiversx/sdk-dapp/UI";
import { apiTimeout, walletConnectV2ProjectId } from "./config";
import { Navbar } from "./components/Layout/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Start } from "./pages/Start/Start";
import { Content } from "./components/Layout/Content";
import { Unlock } from "./pages/Unlock/Unlock";
import { UploadMusicData } from "./pages/Upload/UploadMusicDataNft";
import { UploadTrailblazerData } from "./pages/Upload/UploadTrailblazerData";
import LandingPage from "./pages/LandingPage/LandingPage";
import StoreDataAsset from "./pages/StoreDataAsset.tsx/StoreDataAssetPage";
import DataBunker from "./pages/DataBunker/DataBunker";
import UploadAnyFiles from "./pages/Upload/UploadAnyFiles";
import CampaignPage from "./pages/CampaignPage/CampaignPage";
import { ELROND_NETWORK } from "./utils/constants";
import { PageNotFound } from "pages/PageNotFound/PageNotFound";
import { Toaster } from "@libComponents/Sooner";
import UploadStaticData from "pages/Upload/UploadStaticData";

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
    path: "/upload-static",
    title: "Upload Static Data to IPFS",
    component: UploadStaticData,
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
  {
    path: "*",
    title: "Page Not Found",
    component: PageNotFound,
    authenticatedRoute: false,
  },
];

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    document.body.style.height = `${window.innerHeight}px`;

    return () => {
      document.body.style.height = "";
    };
  }, [pathname]);

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
      <div>
        <Toaster position="top-right" richColors closeButton duration={6000} />
        <div className="flex flex-col min-h-[100svh] text-white backdrop-blur-xl">
          <Navbar />
          <Content>
            <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
              <Routes>
                {routes.map((route) => (
                  <Route key={route.path.trim()} path={route.path} element={<route.component />} />
                ))}
              </Routes>
            </AuthenticatedRoutesWrapper>
          </Content>
        </div>
      </div>
    </DappProvider>
  );
}

export default App;
