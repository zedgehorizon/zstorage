import { CopyIcon, Lightbulb } from "lucide-react";
import React from "react";
import step2Img from "../../assets/img/next-steps-cname.png";
import step4Img from "../../assets/img/next-steps-txt-record.png";
interface NextStepsListProps {
  manifestCid: string;
}

const NextStepsList: React.FC<NextStepsListProps> = (props) => {
  const { manifestCid } = props;
  return (
    <div className=" relative z-10 p-4 text-sm leading-relaxed text-white b rounded-3xl shadow-md">
      <div className="flex flex-row w-full justify-center items-center pb-4 border-b border-accent mb-4">
        <span className="font-bold text-lg  text-center">Connect your Data Asset to your Domain</span>
        <Lightbulb className="text-accent" />
      </div>

      <div className="overflow-y-auto max-h-[25rem]">
        <span className="font-bold text-lg  text-center justify-center">
          Let's connect your Data Asset to your domain so it can be easily accessed by anyone:
        </span>
        <ol className="list-decimal ml-4 mt-4">
          <li className="mb-4">
            <p className="font-bold">Decide on a subdomain that will open your Data Asset:</p>
            <p>e.g. https://pepe1.yourdomain.com</p>
          </li>
          <li className="mb-4">
            <p className="font-bold">Update DNS settings for your domain:</p>
            <p>
              Open the DNS control panel of your domain via your domain provider (e.g. GoDaddy, NameCheap, CloudFlare). You will need to setup a new CNAME and
              TXT record as mentioned below.
            </p>
          </li>
          <li className="mb-4">
            <p className="font-bold">CNAME Record Setup:</p>
            <p>
              Add a new CNAME record for your domain. Specify the subdomain you wish to use. Point this subdomain to a supported public IPFS gateway, like :
              <div className="text-accent text-sm mb-3 flex">
                ipfs.namebase.io.{" "}
                <CopyIcon className="ml-5 h-5 w-5 cursor-pointer text-accent" onClick={() => navigator.clipboard.writeText("ipfs.namebase.io.")} />
              </div>
            </p>
            <img src={step2Img} alt="Step 2" className="w-[300px] h-[40px]" />
          </li>
          <li className="mb-4">
            <div className="flex flex-row gap-2">
              <p className="font-bold">DNSLink TXT Record Setup:</p>
            </div>

            <div>
              Create a new TXT record. Name it <span className="text-accent text-sm">_dnslink.yoursubdomain</span> (e.g. _dnslink.pepe1) and set its value to:{" "}
              <br />
              <div className="text-accent text-sm mb-3 flex">
                {`dnslink=/ipfs/${manifestCid}`}{" "}
                <CopyIcon className="ml-5 h-5 w-5 cursor-pointer text-accent" onClick={() => navigator.clipboard.writeText("dnslink=/ipfs/" + manifestCid)} />
              </div>
            </div>

            <img src={step4Img} alt="Step 3" className="w-full" />
          </li>

          <li className="mb-4">
            <p className="font-bold">Test your DNS linking:</p>
            <p>
              If you have done the above, your may still need to wait for some time for your domain linking to work. Try accessing your domain (e.g.
              https://pepe1.yourdomain.com) in a browser to check if it resolves to your data asset. Based on how the IPFS network works, it may take time for
              it to resolve and testing the domain multiple times can actually speed up the DNS linking.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default NextStepsList;
