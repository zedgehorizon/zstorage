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
    return "hover:!bg-accent/25 focus:!bg-accent/75  focus:!border-0 !bg-muted-foreground/5 !rounded-2xl !py-3 !border-accent/25 !text-center !text-foreground/75 !text-base !font-medium !leading-relaxed";
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

  <div className="w-[419px] h-[487px] relative bg-zinc-900 rounded-[20px] border border-lime-300 border-opacity-5">
    <div className="left-[93px] top-[24px] absolute text-lime-300 text-2xl font-medium font-['Space Grotesk'] leading-[28.80px]">Connect your wallet</div>
    <div className="w-[360px] h-[0px] left-0 top-[69px] absolute border border-lime-300 border-opacity-25"></div>
    <div className="w-[355px] h-14 py-[15px] left-[32px] top-[125px] absolute bg-stone-50 bg-opacity-5 rounded-[20px] border border-lime-300 border-opacity-25 justify-center items-center inline-flex">
      <div className="text-center text-stone-50 text-opacity-75 text-base font-medium font-['Space Grotesk'] leading-relaxed">Extension</div>
    </div>
    <div className="w-[355px] h-14 py-[15px] left-[32px] top-[193px] absolute bg-stone-50 bg-opacity-5 rounded-[20px] border border-lime-300 border-opacity-25 justify-center items-center inline-flex">
      <div className="text-center text-stone-50 text-opacity-75 text-base font-medium font-['Space Grotesk'] leading-relaxed">xPortal App</div>
    </div>
    <div className="w-[355px] h-14 py-[15px] left-[32px] top-[261px] absolute bg-stone-50 bg-opacity-5 rounded-[20px] border border-lime-300 border-opacity-25 justify-center items-center inline-flex">
      <div className="text-center text-stone-50 text-opacity-75 text-base font-medium font-['Space Grotesk'] leading-relaxed">Web wallet</div>
    </div>
    <div className="w-[355px] h-14 py-[15px] left-[32px] top-[329px] absolute bg-stone-50 bg-opacity-5 rounded-[20px] border border-lime-300 border-opacity-25 justify-center items-center inline-flex">
      <div className="text-center text-stone-50 text-opacity-75 text-base font-medium font-['Space Grotesk'] leading-relaxed">Ledger</div>
    </div>
    <div className="w-[355px] h-14 pl-[119px] pr-[120px] py-[15px] left-[32px] top-[397px] absolute bg-stone-50 bg-opacity-5 rounded-[20px] border border-lime-300 border-opacity-25 justify-center items-center inline-flex">
      <div className="text-center text-stone-50 text-opacity-75 text-base font-medium font-['Space Grotesk'] leading-relaxed">Google (xAlias)</div>
    </div>
    <div className="left-[74px] top-[86px] absolute text-stone-50 text-opacity-75 text-sm font-normal font-['Space Grotesk'] leading-snug">
      Choose a wallet you want to connect to
    </div>
    <div className="w-6 h-6 p-[6.75px] left-[363px] top-[23px] absolute rounded-3xl border border-stone-50 justify-center items-center inline-flex" />
  </div>;
  return (
    <div className="w-[30%] h-full relative bg-zinc-900 rounded-[20px] border border-accent/25 border-opacity-5 p-4">
      <div className="flex flex-col w-full gap-2">
        <div className="w-[100%] bg-gradient-to-r from-zinc-900 via-accent/50 to-zinc-900 pb-[1px] -z-1">
          <div className="w-full bg-zinc-900 flex justify-center  text-accent text-2xl font-medium p-3 z-3">Connect your wallet</div>
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
          customWalletAddress="https://web2auth.com"
          {...commonProps}></WebWalletLoginButton>
      </div>
    </div>
  );
};
