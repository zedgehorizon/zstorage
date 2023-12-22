import React, { useState } from "react";

import { XStorageCheckBox } from "../../components/InputComponents/XStorageCheckBox";
import { Link } from "react-router-dom";
import { DataAssetList } from "../../components/Lists/DataAssetsList";
import zImageHalf from "../../assets/img/z-image-half.png";
import storageIcon from "../../assets/logo/ic_baseline-updatestore.png";
import updateIcon from "../../assets/logo/ic_baseline-updateupdate.png";

import { ListRestartIcon, X, XCircle } from "lucide-react";
export const Home: React.FC = () => {
  // options
  const [dataAssetAction, setDataAssetAction] = useState("");
  const [dynamicDataStreamOption, setDynamicDataStreamOption] = useState();
  const [dynamicDataStream, setDynamicDataStream] = useState();
  const [storage, setStorage] = useState();
  const [decentralizedStorage, setDecentralizedStorage] = useState();

  const descriptions = ["Description1", "Description2", "Description3", "ASD"]; // Replace with your actual descriptions array

  function checkSelectedOptions() {
    if (dataAssetAction === "Update Data Asset" || !dataAssetAction || !dynamicDataStreamOption || !dynamicDataStream || !storage || !decentralizedStorage) {
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-background z-[-2]">
        <img src={zImageHalf} className="z-[-1] absolute right-0 max-w-[30rem] w-[60%] h-screen"></img>
        <div className="flex flex-col z-2 w-[80%]   md:w-[55%] xl:w-[45%]  bg-muted rounded-2xl border border-accent/25  ">
          <div className="flex flex-row w-full rounded-2xl bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px]">
            <div className="flex-grow flex justify-center items-center bg-muted rounded-tl-2xl text-accent text-3xl font-medium py-8">
              <p>Get Started with zStorage</p>
            </div>
            <div className=" bg-muted rounded-r-2xl  flex items-center pr-4">
              <XCircle className="w-6 h-6 text-foreground cursor-pointer" />
            </div>
          </div>

          <div className="text-foreground text-center text-base py-6 ">What would you like to do today?</div>
          <div className="flex flex-col gap-4 pb-16 items-center justify-center">
            <div
              onClick={() => setDataAssetAction(`Update Data Asset`)}
              className="cursor:pointer hover:bg-accent/25 focus:bg-accent/75 w-[80%] p-4 bg-foreground/5  rounded-lg border border-accent/25 items-center gap-4 inline-flex">
              <div className=" w-12 h-12 p-3 bg-foreground  rounded-2xl  justify-center items-center inline-flex">
                {/* <ListRestartIcon color="black" /> */}
                <img src={updateIcon}></img>
              </div>
              <span className="text-center text-foreground/75 text-base ">Update previously stored data asset</span>
            </div>
            <div
              onClick={() => setDataAssetAction(`Create Data Asset`)}
              className="cursor:pointer hover:bg-accent/25 focus:bg-accent/75 w-[80%] p-4 bg-foreground/5 bg-opacity-5 rounded-lg border border-accent/25 items-center gap-4 inline-flex">
              <div className="w-12 h-12 p-3 bg-foreground  rounded-2xl justify-center items-center inline-flex">
                <img src={storageIcon}></img>
              </div>
              <span className="text-center text-foreground/75 text-base ">Store data asset </span>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="w-full  min-h-screen flex flex-col justify-center items-center gap-12 p-12">
    //   <XStorageCheckBox
    //     title="What would you like to do today?"
    //     description=""
    //     options={["Update Data Asset", "Create Data Asset"]}
    //     descriptions={descriptions}
    //     setterFunction={setDataAssetAction}
    //   />
    //   {dataAssetAction === "Update Data Asset" ? (
    //     <div className="w-full">
    //       <DataAssetList />
    //     </div>
    //   ) : (
    //     dataAssetAction === "Create Data Asset" && (
    //       <>
    //         <XStorageCheckBox
    //           title="Create Data Asset"
    //           description="Do you want static storage or dynamic storage of your data assets?"
    //           options={["Static Data Asset", "Dynamic Data Asset"]}
    //           descriptions={descriptions}
    //           setterFunction={setDynamicDataStreamOption}
    //           disabled={[true, false]}
    //         />
    //         <div className="z-[-1] relative w-full ">
    //           <div className="absolute top-0 -left-4 w-96 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob "></div>
    //           <div className="absolute top-0 -right-4 w-72 h-96 bg-[#300171] rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-2000"></div>
    //           <div className="absolute -bottom-8 left-20 w-96 h-72 bg-sky-500/70 rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-4000"></div>
    //         </div>
    //         <XStorageCheckBox
    //           title="Create Dynamic Data Asset"
    //           description="Is there a specefic Itheum data Stream template that you would like to use?"
    //           options={["Music Data Nft", "TrailBrazer", "Create my own"]}
    //           descriptions={descriptions}
    //           setterFunction={setDynamicDataStream}
    //           disabled={[false, true, true]}
    //         />

    //         <XStorageCheckBox
    //           title="Storage preference"
    //           description="How would you like your data to be storaged?"
    //           options={["Centralized web2 Storage", "Decentralized web3 Storage"]}
    //           descriptions={descriptions}
    //           setterFunction={setStorage}
    //           disabled={[true, false]}
    //         />
    //         {storage == "Decentralized web3 Storage" && (
    //           <XStorageCheckBox
    //             title="Decentralized web3 Storage"
    //             description="What decentralized solution would you like to go with?"
    //             options={["DNS (domain) + IPFS", "DNS (domain) + Arweave", "Ceramic", "IPNS + IPFS"]}
    //             descriptions={descriptions}
    //             setterFunction={setDecentralizedStorage}
    //             disabled={[false, true, true, true]}
    //           />
    //         )}
    //       </>
    //     )
    //   )}

    //   {checkSelectedOptions() ? (
    //     <Link
    //       to={"/upload"}
    //       state={{
    //         action: dataAssetAction,
    //         type: dynamicDataStreamOption,
    //         template: dynamicDataStream,
    //         storage: storage,
    //         decentralized: decentralizedStorage,
    //       }}
    //       className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600">
    //       Next
    //     </Link>
    //   ) : (
    //     <></>
    //   )}

    // </div>
  );
};
