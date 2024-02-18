import React from "react";
import { Link } from "react-router-dom";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import logo from "../../assets/logo/logo.png";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import { Dot, Home, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger } from "../../libComponents/DropdownMenu";
import { Button } from "../../libComponents/Button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

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
              {/* <Link className=" cursor-pointer group " to={"/#testimonials"} onClick={() => scrollToSection("testimonials")}>
              <p className=" ">Testimonials</p>
              <div className="opacity-0 group-hover:opacity-100">
                <Dot className="text-accent scale-[2] mx-auto "></Dot>
              </div>
            </Link> */}
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
          <div className="lg:!flex !hidden border-2 border-accent hover:bg-accent  rounded-full text-accent hover:text-accent-foreground font-bold">
            {isLoggedIn ? (
              <Link to={"/"}>
                <p className="px-8 py-2" onClick={handleLogout}>
                  Logout
                </p>
              </Link>
            ) : (
              <Link to={"/unlock"}>
                <p className="px-8 py-2">Login</p>{" "}
              </Link>
            )}
          </div>
          <div className="lg:!hidden !visible flex items-center justify-center z-10">
            <DropdownMenu>
              <div className="flex flex-row">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent className="w-56 border border-accent rounded-3xl bg-muted p-4 ">
                <DropdownMenuGroup>
                  <Link to={"/"}>
                    <DropdownMenuItem className="flex">
                      <span>Home</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#features"} onClick={() => scrollToSection("features")}>
                    <DropdownMenuItem>Features </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#solution"} onClick={() => scrollToSection("solution")}>
                    <DropdownMenuItem>Solution </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <Link className=" cursor-pointer group " to={"/#pricing"} onClick={() => scrollToSection("pricing")}>
                    <DropdownMenuItem>Pricing </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                {isLoggedIn && (
                  <>
                    <DropdownMenuGroup>
                      <Link className=" cursor-pointer group " to={"/itheum-music-data-nft"}>
                        <DropdownMenuItem>Music Data NFT Storage </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <Link className="cursor-pointer group " to={"/start"}>
                        <p className=" ">Get Started</p>
                      </Link>{" "}
                    </DropdownMenuGroup>
                  </>
                )}
                <DropdownMenuGroup>
                  <div className="mt-4 w-full flex items-center jusitfy-center text-center border-2 border-accent hover:bg-accent p-4 lg:px-8 py-2 rounded-full text-accent hover:text-accent-foreground font-bold">
                    {isLoggedIn ? (
                      <Link to={"/"} className="flex w-full items-center jusitfy-center text-center ">
                        <div className="w-full " onClick={handleLogout}>
                          Logout
                        </div>
                      </Link>
                    ) : (
                      <Link to={"/unlock"} className="w-full">
                        <p className="">Login</p>{" "}
                      </Link>
                    )}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
