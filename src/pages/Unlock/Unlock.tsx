import React, { useMemo } from "react";
import { ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { useNavigate } from "react-router-dom";

export const Unlock: React.FC = () => {
  const navigate = useNavigate();

  const buttonStyles = useMemo(() => {
    return "!rounded-xl !border-0 !bg-teal-500 !shadow-xl !w-full !m-0 !px-10";
  }, []);

  return (
    <div className="shadow-inner shadow-white rounded-xl bg-transparent backdrop-blur-3xl p-14">
      <div className="flex flex-col w-full gap-4">
        <ExtensionLoginButton
          className={buttonStyles}
          callbackRoute={"/"}
          onLoginRedirect={() => navigate("/")}
          loginButtonText={"Extension"}
        />
        <WalletConnectLoginButton
          className={buttonStyles}
          callbackRoute={"/"}
          onLoginRedirect={() => navigate("/")}
          loginButtonText={"xPortal"}
        />
        <WebWalletLoginButton className={buttonStyles} callbackRoute={"/"} loginButtonText={"Web wallet"} />
      </div>
    </div>
  );
};
