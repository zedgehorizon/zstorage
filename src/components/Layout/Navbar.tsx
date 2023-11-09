import React from "react";
import { Link } from "react-router-dom";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import { Home, Menu, Store, Wallet } from "lucide-react";
import lightLogo from "assets/img/logo-icon-b.png";
import darkLogo from "assets/img/logo-sml-d.png";
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
    <nav className="text-white text-xl">
      <div className="flex flex-row justify-left p-12 items-center h-20 justify-between">
        <Link to={"/"} className="flex flex-row">
          <p className="text-xl text-left font-bold">zStorage</p>
        </Link>
        {isLoggedIn ? (
          <Link to={"/"} className="flex flex-row   ">
            <Button className="text-xl text-left font-bold" onClick={handleLogout}>
              Logout
            </Button>
          </Link>
        ) : (
          <Link to={"/unlock"} className="flex flex-row  ">
            <p className="text-xl text-left font-bold">Connect</p>{" "}
          </Link>
        )}
      </div>
    </nav>
  );
};
