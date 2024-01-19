import React, { useMemo } from "react";
import { ExtensionLoginButton, LedgerLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { useNavigate } from "react-router-dom";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { getApi } from "../../utils/misc";
import { walletConnectV2ProjectId } from "../../config";
import zImageHalf from "../../assets/img/z-image-half.png";

export const Unlock: React.FC = () => {
  const navigate = useNavigate();

  const buttonStyles = useMemo(() => {
    return "hover:!bg-accent/25 focus:!bg-accent/75  focus:!border-0 !bg-muted-foreground/5 !rounded-2xl !py-3 !border-accent/25 !text-center !text-foreground/75 !text-base !font-medium !leading-relaxed";
  }, []);

  const { chainID } = useGetNetworkConfig();

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getApi(chainID)}`,
    // origin: window.location.origin,
    expirySeconds: 3000,
  };
  const commonProps = {
    callbackRoute: "/",
    nativeAuth: {
      ...nativeAuthProps,
    },
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-background z-[-2]">
      <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-screen"></img>
      <div className="w-[30%] relative bg-muted rounded-[20px] border border-accent/25 border-opacity-5 p-4">
        <div className="flex flex-col w-full gap-2">
          <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px] -z-1">
            <div className="w-full bg-muted flex justify-center  text-accent text-2xl font-medium p-3 z-3">Connect your wallet</div>
          </div>
          <div className="text-foreground/50 text-center text-sm py-1 ">Choose a wallet you want to connect to</div>

          <ExtensionLoginButton
            className={buttonStyles}
            {...commonProps}
            callbackRoute={"/"}
            onLoginRedirect={() => navigate("/")}
            loginButtonText={"Extension"}
          />
          <WalletConnectLoginButton
            className={buttonStyles}
            {...commonProps}
            callbackRoute={"/"}
            onLoginRedirect={() => navigate("/")}
            loginButtonText="xPortal App"
            {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})}
          />
          <WebWalletLoginButton className={buttonStyles} {...commonProps} callbackRoute={"/"} loginButtonText={"Web wallet"} />
          <LedgerLoginButton className={buttonStyles} loginButtonText="Ledger" {...commonProps} />
          <WebWalletLoginButton
            className={buttonStyles}
            loginButtonText={"Google (xAlias)"}
            buttonClassName="auth_button"
            customWalletAddress="https://devnet.xalias.com"
            {...commonProps}></WebWalletLoginButton>
        </div>
      </div>
    </div>
  );
};
