import { Check, Loader, Loader2 } from "lucide-react";
import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-[33rem] mx-auto  my-12 z-10">
      <div className="bg-gray-200 h-1 flex items-center justify-between">
        {" "}
        <div className="w-1/4">
          {progress == 0 ? (
            <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center">
              <div className="bg-accent h-3 w-3 rounded-full shadow flex items-center justify-center">
                <div className="relative bg-white  shadow-lg px-2 py-1 rounded mt-20  ">
                  <p tabIndex={0} className="focus:outline-none text-accent-foreground text-xs font-bold">
                    Update data
                  </p>
                </div>
              </div>{" "}
            </div>
          ) : (
            <div className="w-[11rem] flex justify-between bg-accent h-1 items-center relative">
              <div className="bg-accent h-6 w-6 rounded-full shadow flex items-center justify-center">
                <Check className="scale-75 text-accent-foreground" />
              </div>
            </div>
          )}
        </div>
        <div className="w-1/4">
          {progress > 20 ? (
            <div className="w-[11rem]  flex justify-between bg-accent h-1 items-center relative">
              <div className="bg-accent h-6 w-6 rounded-full shadow flex items-center justify-center">
                <Check className="scale-75  text-accent-foreground" />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center">
                {progress == 20 && <Loader color={"black"} className="absolute scale-75 animate-ping "></Loader>}

                <div className="bg-accent h-3 w-3 rounded-full shadow flex items-center justify-center">
                  <div className="  relative bg-white text-center shadow-lg px-2 py-1 rounded mt-20  ">
                    <p tabIndex={0} className="focus:outline-none text-accent-foreground text-xs font-bold">
                      Uploading files
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-1/4 ">
          {progress > 60 ? (
            <div className="w-[11rem]  flex justify-between bg-accent h-1 items-center relative">
              <div className="bg-accent h-3 w-3 rounded-full shadow flex items-center justify-center">
                <div className="bg-accent h-6 w-6 rounded-full shadow flex items-center justify-center">
                  <Check className="scale-75  text-accent-foreground" />
                </div>
              </div>{" "}
            </div>
          ) : (
            <>
              <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center">
                {progress == 60 && <Loader color={"black"} className="absolute scale-75 animate-ping "></Loader>}
                <div className="bg-accent h-3 w-3 rounded-full shadow flex items-center justify-center">
                  <div className="relative bg-white text-center shadow-lg px-2 py-1 rounded mt-20">
                    <p tabIndex={0} className="focus:outline-none text-accent-foreground text-xs font-bold">
                      Uploading manifest
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className=" ">
          {progress === 100 ? (
            <div className="bg-accent h-6 w-6 rounded-full shadow flex items-center justify-center">
              <Check className="scale-50" />
            </div>
          ) : (
            <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center">
              <div className="bg-accent h-3 w-3 rounded-full shadow flex items-center justify-center">
                <div className="relative bg-white  shadow-lg px-2 py-1 rounded mt-20  ">
                  <p tabIndex={0} className="focus:outline-none text-accent-foreground text-xs font-bold">
                    Success
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
