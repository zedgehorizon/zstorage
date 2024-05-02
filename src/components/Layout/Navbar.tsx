import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import logo from "@assets/logo/logo.png";
import { useGetAccount, useGetIsLoggedIn, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks/account";
import { Dot, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger } from "@libComponents/DropdownMenu";
import { Button } from "@libComponents/Button";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { getUserAvailableSpace, shortenAddress } from "@utils/functions";
import { useHeaderStore } from "store/header";
import { add } from "date-fns";

export const Navbar: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { updateAvailableSpaceToUpload, availableSpaceToUpload } = useHeaderStore((state: any) => ({
    updateAvailableSpaceToUpload: state.updateAvailableSpaceToUpload,
    availableSpaceToUpload: state.availableSpaceToUpload,
  }));

  const handleLogout = () => {
    updateAvailableSpaceToUpload(-1);
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

  useEffect(() => {
    const fetchAvailableSpace = async () => {
      if (address) {
        const availableSpace = await getUserAvailableSpace(tokenLogin?.nativeAuthToken ?? "");
        if (availableSpace >= 0) updateAvailableSpaceToUpload(availableSpace);
      } else {
        if (availableSpaceToUpload >= 0) updateAvailableSpaceToUpload(-1);
      }
    };
    fetchAvailableSpace();
  }, [address, availableSpaceToUpload]);

  return (
    <nav>
      <div className="bg-gradient-to-r from-black via-accent/50 to-black pb-[1px] z-11">
        <div className="bg-background flex flex-row justify-left p-4 xl:px-24 items-center h-20 justify-between">
          <Link to={"/"} className="flex flex-row justify-center items-center text-2xl gap-1 ">
            <img className="h-4" src={logo}></img>
            <p className=" ">EdgeStorage</p>
          </Link>
          <div className="lg:!flex !hidden  divide-x divide-accent ">
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
            </div>
            {isLoggedIn && (
              <div className="flex flex-row gap-8 mt-4 pl-4">
                <Link className=" cursor-pointer group" to={"/data-bunker"}>
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
          <div className="lg:!flex !hidden flex-row  justify-center items-center gap-4">
            <div className=" flex flex-col justify-center items-center ">
              {availableSpaceToUpload >= 0 && <p className=" text-accent w-full "> Space: {(availableSpaceToUpload / 1000 ** 2).toFixed(2)} MB</p>}
              {address && <p className=" text-accent "> {shortenAddress(address, 6)}</p>}
            </div>

            <div className="lg:!flex !hidden border-2 border-accent hover:bg-accent  rounded-full text-accent hover:text-accent-foreground font-bold">
              {isLoggedIn ? (
                <Link to={"/"}>
                  <p className="px-8 py-2" onClick={handleLogout}>
                    Logout
                  </p>
                </Link>
              ) : (
                <Link to={"/unlock"}>
                  <p className="px-8 py-2">Login</p>
                </Link>
              )}
            </div>
          </div>

          <div className="lg:!hidden !visible flex items-center justify-center z-10">
            <DropdownMenu>
              <div className="flex flex-row justify-center items-center">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent className="w-56 border border-accent rounded-3xl bg-muted p-4">
                <DropdownMenuGroup>
                  <Link to={"/"}>
                    <DropdownMenuItem>
                      <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px] -z-1">
                        <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">Home</div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#features"} onClick={() => scrollToSection("features")}>
                    <DropdownMenuItem>
                      <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[1px] -z-1">
                        <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">Features</div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#solution"} onClick={() => scrollToSection("solution")}>
                    <DropdownMenuItem>
                      <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[1px] -z-1">
                        <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">Solution</div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#pricing"} onClick={() => scrollToSection("pricing")}>
                    <DropdownMenuItem>
                      <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[1px] -z-1">
                        <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">Pricing</div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/itheum-music-data-nft"}>
                    <DropdownMenuItem>
                      <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[1px] -z-1">
                        <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">Music Data NFT Storage</div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                {isLoggedIn && (
                  <>
                    <DropdownMenuGroup>
                      <Link className=" cursor-pointer group " to={"/data-bunker"}>
                        <DropdownMenuItem>
                          <div className="w-[100%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[1px] -z-1">
                            <div className="w-full bg-muted flex justify-center text-accent font-medium py-1">My Data Bunker</div>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <Link className="cursor-pointer group " to={"/start"}>
                        <DropdownMenuItem>
                          <div className="w-full bg-muted flex justify-center text-accent font-medium py-1 animate-none">Get started</div>
                          <div className="w-[90%] ml-[5%] bg-gradient-to-r from-muted via-accent/50  to-muted pb-[3px] -z-1 animate-rubberBand "></div>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </>
                )}
                <DropdownMenuGroup>
                  <p className="text-accent text-xs text-center"> Available Space: {(availableSpaceToUpload / 1024 ** 2).toFixed(2)} MB</p>{" "}
                  <div className="w-full bg-muted flex justify-center text-accent font-medium ">
                    {address && <p className="text-accent"> {shortenAddress(address, 4)}</p>}
                  </div>
                  <DropdownMenuItem className="w-full flex items-center jusitfy-center text-center border-2 border-accent hover:bg-accent lg:px-8  rounded-full text-accent hover:text-accent-foreground font-bold">
                    {isLoggedIn ? (
                      <Link to={"/"} className="w-full ">
                        <DropdownMenuItem>
                          <div className="w-full " onClick={handleLogout}>
                            Logout
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    ) : (
                      <Link to={"/unlock"} className="w-full">
                        <DropdownMenuItem>
                          <div className="w-full">Login</div>
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
