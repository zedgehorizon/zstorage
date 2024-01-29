import React from "react";

const NextStepsList: React.FC = () => {
  return (
    <div className="w-[400px] relative z-10 p-4 text-sm leading-relaxed text-white bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl">
      <ol className="list-decimal ml-4">
        <p>To point a subdomain to your IPFS file after generating its hash via zEdgeStorage, follow these refined steps:</p>
        <li>
          <p>Access Domain Controller: Open the control panel of your domain provider.</p>
        </li>
        <li>
          <p>
            CNAME Record Setup: Add a CNAME record for your domain. Specify the subdomain you wish to use. Point this subdomain to a public IPFS gateway, such
            as "ipfs.namebase.io."
          </p>
        </li>
        <li>
          <p>Obtain IPFS Manifest Hash: Retrieve the IPFS manifest hash from your zEdgeStorage.</p>
        </li>
        <li>
          <p>DNSLink TXT Record: Create a new TXT record. Name it _dnslink.yoursubdomain and set its value to dnslink=/ipfs/"IPFS manifest file hash."</p>
        </li>
        <li>Response header modification: In the response header add "x-amz-meta-marshal-deep-fetch" with value 1 </li>
        <li>
          <p>This will effectively link your subdomain to the IPFS file using DNS records.</p>
        </li>
      </ol>
    </div>
  );
};

export default NextStepsList;
