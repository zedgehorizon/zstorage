import React from "react";
import { Link } from "react-router-dom";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import logo from "../../assets/logo/logo.png";
import { useGetAccount, useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";

import { Button } from "../../libComponents/Button";
export const Navbar: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const handleLogout = () => {
    // logout(`${window.location.origin}/unlock`);
    logout(`${window.location.origin}`, undefined, false);
  };

  return (
    <nav>
      <div className="bg-gradient-to-r from-black via-accent/50 to-black pb-[1px] z-11">
        <div className="bg-background  flex flex-row justify-left px-24 items-center h-20 justify-between">
          <Link to={"/landing"} className="flex flex-row justify-center items-center text-2xl gap-1">
            <img className="h-4" src={logo}></img>
            <p className=" ">Storage</p>
          </Link>
          <div className="flex flex-row gap-8 ">
            <Link to={"/"}>
              <p className=" ">Features</p>
            </Link>
            <Link to={"/"}>
              <p className=" ">Solution</p>
            </Link>
            <Link to={"/"}>
              <p className=" ">Video Guides</p>
            </Link>
            <Link to={"/"}>
              <p className=" ">Documentation</p>
            </Link>
          </div>
          <div className="border-2 border-accent hover:bg-accent px-8 py-2 rounded-full text-accent hover:text-accent-foreground font-bold">
            {isLoggedIn ? (
              <Link to={"/"}>
                <div className=" " onClick={handleLogout}>
                  Logout
                </div>
              </Link>
            ) : (
              <Link to={"/unlock"}>
                <p className="">Connect wallet</p>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
