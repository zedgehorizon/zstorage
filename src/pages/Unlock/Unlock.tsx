import React, { useMemo } from "react";
import { ExtensionLoginButton, LedgerLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { useNavigate } from "react-router-dom";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { getApi } from "../../utils/misc";
import { walletConnectV2ProjectId } from "../../config";
import zImageHalf from "../../assets/img/z-image-half.png";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ELROND_NETWORK } from "../../utils/constants";
import { Modal } from "../../components/Modal";
import xAliasIssue from "../../assets/img/xalias-issue-dashboard.png";
import { Button } from "../../libComponents/Button";

export const Unlock: React.FC = () => {
  const navigate = useNavigate();

  const buttonStyles = useMemo(() => {
    return "hover:!bg-accent/25 focus:!bg-accent/75 focus:!border-0 !bg-muted-foreground/5 !rounded-2xl !py-3 !border-accent/25 !text-center !text-foreground/75 !text-base !font-medium !leading-relaxed";
  }, []);

  const { chainID } = useGetNetworkConfig();

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getApi(chainID)}`,
    // origin: window.location.origin,
    expirySeconds: 3000,
  };

  let onCloseReturnRoute = "/";
  let loginCallbackRoute = "/start";
  let xAliasEnv = "https://xalias.com";

  if (document?.location?.search.includes("?r=itheum-music-data-nft")) {
    onCloseReturnRoute += `?r=itheum-music-data-nft`;
    loginCallbackRoute += `?r=itheum-music-data-nft`;
  }

  const commonProps = {
    callbackRoute: loginCallbackRoute,
    onLoginRedirect: () => navigate(loginCallbackRoute),
    nativeAuth: {
      ...nativeAuthProps,
    },
  };

  console.log("commonProps", commonProps);

  if (ELROND_NETWORK === "devnet") {
    xAliasEnv = "https://devnet.xalias.com";
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center w-full h-full gap-4 bg-background z-[-2] min-h-[100svh]">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-[100svh]"></img>

      <div className="w-full lg:w-[38%] relative bg-muted rounded-[20px] border border-accent/25 border-opacity-5 p-4">
        <div className="flex flex-col w-full gap-2">
          <Link to={onCloseReturnRoute} className="bg-muted rounded-r-2xl flex items-center pr-4 absolute right-0">
            <XCircle className="w-6 h-6 text-foreground cursor-pointer" />
          </Link>
          <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px] -z-1">
            <div className="w-full bg-muted flex justify-center text-accent text-2xl font-medium">Create or Connect a Digital Wallet</div>

            <div className="w-full bg-muted flex justify-center text-xs font-medium p-3 z-3 text-center">
              A digital wallet is what ensures that you have sovereignty over your zEdgeStorage data bunker.
            </div>
          </div>

          <p className="text-xs flex justify-center mt-2">Use your Google Account to generate your sovereign digital wallet.</p>
          <div className="text-sm text-center text-red-400">
            Google Login is in BETA; You may have some issues logging in :
            <Modal
              modalClassName="w-[70%] border-accent/50"
              footerContent={<Button className={"px-8 border border-accent bg-background rounded-full hover:shadow hover:shadow-accent"}>Close</Button>}
              openTrigger={
                <a href="#" className="text-accent hover:underline ml-1">
                  Learn more
                </a>
              }
              closeOnOverlayClick={true}>
              {
                <div className=" relative z-10 p-4 text-sm leading-relaxed text-white b rounded-3xl shadow-md">
                  <div className="flex flex-row w-full justify-center items-center pb-4 border-b border-accent mb-4">
                    <span className="font-bold text-lg text-center">Using "Login With Google" in BETA Mode</span>
                  </div>
                  <span className="font-bold text-lg  text-center justify-center">
                    The "Login with Google" feature is provided by{" "}
                    <a href="https://xalias.com" target="_blank" className="text-accent hover:underline">
                      MultiversX xAlias
                    </a>{" "}
                    and allows you to use your Google Account to generate your sovereign digital wallet securely. Note this feature is currently in BETA mode,
                    which means it MAY have some issues.
                  </span>

                  <p className="font-bold mt-5 underline">Ideal User Experience:</p>
                  <p className="font-bold">
                    Once you login in for the first time, you will be asked for permission to use your Google Account to securely create a "sovereign" digital
                    wallet for you in a few steps. Once the process has been completed, you should get seamlessly redirected back to ZedgeStorage with your
                    digital wallet created and logged in to use all the features of ZedgeStorage.
                  </p>

                  <div className="flex">
                    <div className="flex-2">
                      <div>
                        <p className="font-bold mt-5 underline">The Problem:</p>
                        <p className="font-bold">
                          There are some situations when the Google Wallet creation is completed by xAlias, you DO NOT get redirected back and instead get stuck
                          in a "Dashboard" screen that looks like the image shown :
                        </p>
                      </div>

                      <div>
                        <p className="font-bold mt-5 underline">The Solution:</p>
                        <p className="font-bold">
                          If you are stuck in the "Dashboard" screen, just go back to the homepage{" "}
                          <a href="https://www.zedgestorage.com" target="_blank" className="text-accent hover:underline">
                            zedgestorage.com
                          </a>{" "}
                          and try "Login with Google" again. Second time attempts seem to resolve this issue and you will be redirected back correctly once
                          login is complete.
                        </p>
                      </div>
                    </div>

                    <img src={xAliasIssue} className="w-[300px] ml-2 rounded"></img>
                  </div>

                  <p className="font-bold mt-5 underline">Still have issues?</p>
                  <p className="font-bold">
                    Please "Chat with us" and we'll try and help further OR please use another{" "}
                    <a href="https://docs.itheum.io/product-docs/integrators/supported-wallets" target="_blank" className="text-accent hover:underline">
                      digital wallet that's compatible with the MultiversX Blockchain.
                    </a>
                  </p>
                </div>
              }
            </Modal>
          </div>
          <WebWalletLoginButton
            className={buttonStyles}
            loginButtonText={"Google [BETA]"}
            customWalletAddress={xAliasEnv}
            {...commonProps}></WebWalletLoginButton>

          <div className="text-xs flex justify-center mt-5">
            ... or use{" "}
            <a href="https://docs.itheum.io/product-docs/integrators/supported-wallets" target="_blank" className="text-accent hover:underline ml-1">
              any wallet that's compatible with the MultiversX Blockchain
            </a>
          </div>

          <ExtensionLoginButton className={buttonStyles} loginButtonText={"DeFi Browser Wallet"} {...commonProps} />
          <WalletConnectLoginButton
            className={buttonStyles}
            loginButtonText="xPortal Mobile Wallet"
            {...commonProps}
            {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})}
          />
          <LedgerLoginButton className={buttonStyles} {...commonProps} loginButtonText="Ledger Hardware Wallet" />
          <WebWalletLoginButton className={buttonStyles} {...commonProps} loginButtonText={"Web Wallet"} />
        </div>
      </div>
    </div>
  );
};
