import React, { useState } from "react";

import { XStorageCheckBox } from "../../components/InputComponents/XStorageCheckBox";
import { Button } from "../../libComponents/Button";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  // options
  const [dataAssetAction, setDataAssetAction] = useState();
  const [dynamicDataStreamOption, setDynamicDataStreamOption] = useState();
  const [dynamicDataStream, setDynamicDataStream] = useState();
  const [storage, setStorage] = useState();
  const [descentralizedStorage, setDescentralizedStorage] = useState();

  var options = {
    action: 0, // update, create
    type: 0, //static, dynamic
    template: 0, // music, trailbrazer , create
    storage: 0, // centralized , descentralized
    descentralized: 0, // 4 options
  };

  const descriptions = ["Description1", "Description2", "Description3", "ASD"]; // Replace with your actual descriptions array

  return (
    <div className="  w-full  min-h-screen flex flex-col justify-center items-center gap-12 p-12">
      {/* <div className=" relative w-full max-w-lg">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl "></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#300171] rounded-full  mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-300 rounded-full  mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
      </div> */}
      <span className="text-3xl leading-relaxed">
        <b className="uppercase text-blue-400">xStorage: </b> End-to-End Storage Solution for the Itheum Protocol.&nbsp; <br></br>
        Allows seamless storage solutions that integrate directly with the Itheum data brokerage protocol.
      </span>
      <XStorageCheckBox
        title="What would you like to do today?"
        description=""
        options={["Update Data Asset", "Create Data Asset"]}
        descriptions={descriptions}
        setterFunction={setDataAssetAction}
      />

      <XStorageCheckBox
        title="Create Data Asset"
        description="Do you want static storage or dynamic storage of your data assets?"
        options={["Static Data Asset", "Dynamic Data Asset"]}
        descriptions={descriptions}
        setterFunction={setDynamicDataStreamOption}
      />
      <div className="z-[-1] relative w-full ">
        <div className="absolute top-0 -left-4 w-96 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob "></div>
        <div className="absolute top-0 -right-4 w-72 h-96 bg-[#300171] rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-72 bg-sky-500/70 rounded-full  mix-blend-multiply filter blur-2xl opacity-50  animate-blob animation-delay-4000"></div>
      </div>
      <XStorageCheckBox
        title="Create Dynamic Data Asset"
        description="Is there a specefic Itheum data Stream template that you would like to use?"
        options={["Music Data Nft", "TrailBrazer", "Create my own"]}
        descriptions={descriptions}
        setterFunction={setDynamicDataStream}
      />

      <XStorageCheckBox
        title="Storage preference"
        description="How would you like your data to be storaged?"
        options={["Centralized web2 Storage", "Dentralized web3 Storage"]}
        descriptions={descriptions}
        setterFunction={setStorage}
      />
      {storage == "Dentralized web3 Storage" && (
        <XStorageCheckBox
          title="Decentralized web3 Storage"
          description="What decentralized solution would you like to go with?"
          options={["DNS (domain) + IPFS", "DNS (domain) + Arweave", "Ceramic", "IPNS + IPFS"]}
          descriptions={descriptions}
          setterFunction={setDescentralizedStorage}
        />
      )}
      <Link
        to={"/upload"}
        state={{
          action: dataAssetAction,
          type: dynamicDataStreamOption,
          template: dynamicDataStream,
          storage: storage,
          descentralized: descentralizedStorage,
        }}>
        <Button className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600">Next</Button>
      </Link>
    </div>
  );
};
