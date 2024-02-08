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
        <span className="font-bold text-lg  text-center">Info</span>
        <Lightbulb className="text-accent" />
      </div>
      <span className="font-bold text-lg  text-center justify-center">
        To point a subdomain to your IPFS file after generating its hash via zEdgeStorage, follow these refined steps:
      </span>
      <ol className="list-decimal ml-4 mt-4">
        <li className="mb-2">
          <p className="font-bold">Access Domain Controller:</p>
          <p>Open the control panel of your domain provider.</p>
        </li>
        <li className="mb-2">
          <p className="font-bold">CNAME Record Setup:</p>
          <p>
            Add a CNAME record for your domain. Specify the subdomain you wish to use. Point this subdomain to a public IPFS gateway, such as
            "ipfs.namebase.io."
          </p>
          <img src={step2Img} alt="Step 2" className="w-full" />
        </li>
        <li className="mb-2">
          <div className="flex flex-row gap-2">
            <p className="font-bold">DNSLink TXT Record:</p>
          </div>

          <div>
            Create a new TXT record. Name it _dnslink.yoursubdomain and set its value to: <br />
            <div className=" flex flex-row items-center justify-center font-bold text-lg text-center p-3">
              dnslink=
              <span className="ml-1 text-accent">
                {" "}
                /ipfs/
                {`${manifestCid.substring(0, 6)}...${manifestCid.slice(-6)}`}
              </span>
              <CopyIcon className="ml-1 h-5 w-5 cursor-pointer text-accent" onClick={() => navigator.clipboard.writeText("/ipfs/" + manifestCid)} />
            </div>
          </div>

          <img src={step4Img} alt="Step 3" className="w-full" />
        </li>

        <li className="mb-2">
          <p className="font-bold">Effective Linking:</p>
          <p>This will effectively link your subdomain to the IPFS file using DNS records.</p>
        </li>
      </ol>
    </div>
  );
};

export default NextStepsList;
