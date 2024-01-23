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
import { UploadData } from "./pages/Upload/Upload";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import StoreDataAsset from "./pages/StoreDataAsset.tsx/StoreDataAssetPage";
import DataVault from "./pages/DataVault/DataVault";

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
    component: UploadData,
    authenticatedRoute: true,
  },
  {
    path: "/data-vault",
    title: "Data Vault",
    component: DataVault,
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
];

function App() {
  return (
    <DappProvider
      environment={"devnet"}
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
                <Route path="/upload" element={<UploadData />}></Route>
                <Route path="/data-vault" element={<DataVault />}></Route>
                <Route path="/storage" element={<StoreDataAsset />}></Route>
              </Routes>
            </AuthenticatedRoutesWrapper>
          </Content>
        </div>
      </div>
    </DappProvider>
  );
}

export default App;
