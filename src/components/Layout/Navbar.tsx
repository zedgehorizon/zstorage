import React from "react";
import { Link } from "react-router-dom";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import logo from "../../assets/logo/logo.png";
import { useGetAccount, useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import { Dot } from "lucide-react";

export const Navbar: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    // logout(`${window.location.origin}/unlock`);
    logout(`${window.location.origin}`, undefined, false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (
    <nav>
      <div className="bg-gradient-to-r from-black via-accent/50 to-black pb-[1px] z-11">
        <div className="bg-background flex flex-row justify-left px-24 items-center h-20 justify-between">
          <Link to={"/"} className="flex flex-row justify-center items-center text-2xl gap-1">
            <img className="h-4" src={logo}></img>
            <p className=" ">EdgeStorage</p>
          </Link>
          <div className="flex flex-row divide-x divide-accent">
            <div className="flex flex-row gap-8 mt-4 pr-4">
              <Link className=" cursor-pointer group " to={"/#features"} onClick={() => scrollToSection("features")}>
                <p className=" ">Features</p>
                <div className="opacity-0 group-hover:opacity-100">
                  <Dot className="text-accent scale-[2] mx-auto "></Dot>
                </div>
              </Link>
              <Link className=" cursor-pointer group " to={"/#solution"} onClick={() => scrollToSection("solution")}>
                <p className=" ">Solution</p>
                <div className="opacity-0 group-hover:opacity-100">
                  <Dot className="text-accent scale-[2] mx-auto "></Dot>
                </div>
              </Link>
              <Link className=" cursor-pointer group " to={"/#pricing"} onClick={() => scrollToSection("pricing")}>
                <p className=" ">Pricing</p>
                <div className="opacity-0 group-hover:opacity-100">
                  <Dot className="text-accent scale-[2] mx-auto "></Dot>
                </div>
              </Link>
              <Link className="cursor-pointer group " to={"/itheum-music-data-nft"}>
                <p className=" ">Music Data NFT Storage</p>
                <div className="opacity-0 group-hover:opacity-100">
                  <Dot className="text-accent scale-[2] mx-auto "></Dot>
                </div>
              </Link>
              {/* <Link className=" cursor-pointer group " to={"/#testimonials"} onClick={() => scrollToSection("testimonials")}>
              <p className=" ">Testimonials</p>
              <div className="opacity-0 group-hover:opacity-100">
                <Dot className="text-accent scale-[2] mx-auto "></Dot>
              </div>
            </Link> */}
            </div>
            {isLoggedIn && (
              <div className="flex flex-row gap-8 mt-4 pl-4">
                <Link className=" cursor-pointer group " to={"/data-bunker"}>
                  <p className=" ">My Data Bunker</p>
                  <div className="opacity-0 group-hover:opacity-100">
                    <Dot className="text-accent scale-[2] mx-auto "></Dot>
                  </div>
                </Link>
                <Link className="cursor-pointer group " to={"/start"}>
                  <p className=" ">Get Started</p>
                  <div className="opacity-0 group-hover:opacity-100">
                    <Dot className="text-accent scale-[2] mx-auto "></Dot>
                  </div>
                </Link>
              </div>
            )}
          </div>
          <div className="border-2 border-accent hover:bg-accent  rounded-full text-accent hover:text-accent-foreground font-bold">
            {isLoggedIn ? (
              <Link to={"/"}>
                <div className="px-8 py-2" onClick={handleLogout}>
                  Logout
                </div>
              </Link>
            ) : (
              <Link to={"/unlock"}>
                <p className="px-8 py-2">Login</p>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
