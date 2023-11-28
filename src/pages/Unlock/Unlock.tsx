import React, { useMemo } from "react";
import { ExtensionLoginButton, LedgerLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { useNavigate } from "react-router-dom";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { useLocation } from "react-router-dom";
import { getApi } from "../../utils/misc";
import { walletConnectV2ProjectId } from "../../config";

export const Unlock: React.FC = () => {
  const navigate = useNavigate();

  const buttonStyles = useMemo(() => {
    return "!rounded-xl !border-0 !bg-teal-500 !shadow-xl !w-full !m-0 !px-10";
  }, []);
  const location = useLocation();
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
    <div className="shadow-inner shadow-white rounded-xl bg-transparent backdrop-blur-3xl p-14">
      <div className="flex flex-col w-full gap-4">
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
          loginButtonText={"Custom Web Wallet"}
          buttonClassName="auth_button"
          customWalletAddress="https://web2auth.com"
          {...commonProps}></WebWalletLoginButton>
      </div>
    </div>
  );
};
