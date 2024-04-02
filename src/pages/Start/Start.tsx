import React, { useState } from "react";
import zImageHalf from "@assets/img/z-image-half.png";
import storageIcon from "@assets/logo/ic_baseline-updatestore.png";
import updateIcon from "@assets/logo/ic_baseline-updateupdate.png";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Start = () => {
  let urlHashVal = "";
  let storeNewRoute = "/storage";

  if (document?.location?.search.includes("?r=itheum-music-data-nft")) {
    urlHashVal = `?r=itheum-music-data-nft`;
    storeNewRoute = "/upload-music?r=itheum-music-data-nft";
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-[100svh] bg-background z-[-2]">
        <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-[100svh]"></img>

        <div className="flex flex-col z-2 w-[80%] md:w-[55%] xl:w-[45%] bg-muted rounded-2xl border border-accent/25">
          <div className="flex flex-row w-full rounded-2xl bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px]">
            <div className="flex-grow flex justify-center items-center text-center bg-muted rounded-tl-2xl text-accent lg:text-3xl font-medium py-8 px-4">
              <p>What would you like to do today?</p>
            </div>
            <Link to={"/"} className="bg-muted rounded-r-2xl  flex items-center pr-4">
              <XCircle className="w-6 h-6 text-foreground cursor-pointer" />
            </Link>
          </div>

          <div className="pt-4 flex flex-col gap-4 pb-16 items-center justify-center">
            <Link
              to={`/data-bunker${urlHashVal}`}
              className="cursor-pointer hover:bg-accent/25 focus:bg-accent/75 w-[80%] p-4 bg-foreground/5  rounded-lg border border-accent/25 items-center gap-4 inline-flex">
              <div className=" w-12 h-12 p-3 bg-foreground  rounded-2xl  justify-center items-center inline-flex">
                <img src={updateIcon}></img>
              </div>
              <span className="text-center text-foreground/75 text-base ">Update previously stored data asset</span>
            </Link>
            <Link
              to={storeNewRoute}
              className="cursor-pointer hover:bg-accent/25 focus:bg-accent/75 w-[80%] p-4 bg-foreground/5 bg-opacity-5 rounded-lg border border-accent/25 items-center gap-4 inline-flex">
              <div className="w-12 h-12 p-3 bg-foreground  rounded-2xl justify-center items-center inline-flex">
                <img src={storageIcon}></img>
              </div>
              <span className="text-center text-foreground/75 text-base ">Store new data asset</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
