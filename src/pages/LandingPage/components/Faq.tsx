import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

const Faq: React.FC = () => {
  const [isGatewayCampaignPage, setIsGatewayCampaignPage] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // if the url path is /itheum-gateway, let's lets set a start variable to indicate this so we can do some custom UI
    if (window.location.pathname === "/itheum-gateway") {
      setIsGatewayCampaignPage(true);
    }
  }, []);

  useEffect(() => {
    if (isGatewayCampaignPage) {
      setQuestions(allQuestions.filter((question) => question.showOnGatewayCampaignPageToo) as any);
    } else {
      setQuestions(allQuestions as any);
    }
  }, [isGatewayCampaignPage]);

  const allQuestions = [
    {
      question: "What is zEdgeStorage?",
      answer:
        "zEdgeStorage is a digital data bunker platform for your most vital data assets. It's your 'plan Z' system to protect your most vital data from the risks associated with mainstream, centralized storage systems. These risks include hacks, data breaches, ransomware, censorship, privacy snooping, and data platform lock-in/lock-out. zEdgeStorage does not compete with other storage platforms like AWS, DropBox, or Google Drive. Instead, it compliments and de-risks these platforms to help you minimize your dependency on them.",
      showOnGatewayCampaignPageToo: false,
    },
    {
      question: "Do your store data on the blockchain?",
      answer:
        "zEdgeStorage does NOT store data on the blockchain; it uses multiple underlying distributed data storage systems and abstracts them so that you only interact with zEdgeStorage's user interface. zEdgeStorage does integrate with the Itheum protocol, which provides blockchain-powered data licensing technology called Data NFTs, which uses the transparency and immutability features of a blockchain to implement a decentralized 'access control' layer for your data.",
      showOnGatewayCampaignPageToo: true,
    },
    {
      question: "What is Itheum Gateway by zEdgeStorage?",
      answer:
        "To tokenize data, you first need to selfhost the data and this is where zedge storage Digital Data Bunkers help, but once your data is stored you have to interact with the Itheum protocol to actually tokenize the data assets and data streams and then have the data downloadable or streamable via the itheum protocol brokerage node infrastructure. This whole process can be complex for non-technical users and can be daunting. This is where the Itheum Gateway service comes in, it's an abstraction layer that simplifies your data tokenization and access jobs powered by Itheum. Once you subscribe, all you need to do is share your data files and the complexity of tokenizing your data will be handled. You can receive data NFTs (tokenized version of your data) and access to have your data priority streamed to your end users via Itheum's broker nodes.",
      showOnGatewayCampaignPageToo: true,
    },
    {
      question: "How can I login to create an account?",
      answer:
        "Logging into Zedge Storage is done via a free blockchain wallet. You can use our Google Login wallet options, that uses your Google account to create a real time wallet for you. But this is in Beta so there may be some issues. We will contine to work to improve the login experience but for now the best option would be to use the free xPortal mobile app wallet. You can get it from here: <a href='https://xportal.com/app' target='_blank'>https://xportal.com/app</a> ",
      showOnGatewayCampaignPageToo: true,
    },
    {
      question: "How is zEdgeStorage different to platforms like IPFS and Arweave?",
      answer:
        "zEdgeStorage abstracts all these distributed data storage systems 'under the hood' and provides 'data portability' between this system and centralized systems like AWS and Google Drive. For example, you can upload some vital data to AWS and then move it to IPFS during an emergency (like a cloud outage event or active hack phase) and then move it back to AWS if you want.",
      showOnGatewayCampaignPageToo: false,
    },
    {
      question: "What is zEdgeStorage in relation to Itheum Data NFTs?",
      answer:
        "Itheum's Data NFTs are a revolutionary product that enables anyone to convert their data to Data NFTs (non-fungible tokens). This blockchain-powered data licensing technology uses a blockchain's transparency and immutability features to implement a decentralized 'access control' layer for your data. zEdgeStorage provides seamless integration with Itheum's Data NFTs; for example, if you are a musician and you want to mint your music playlist as a dynamic Music Data NFT, control its royalties and distribution, and activate a direct relationship with your fan base. In that case, you can use zEdgeStorage's built-in UI to manage your Music Data NFT assets like sound files, album art, and metadata. Your Music Data NFTs can then be traded or accessed anywhere NFTs are available, and you can update your music data at any time using storage. You can subscribe to the Gateway service to get started.",
      showOnGatewayCampaignPageToo: true,
    },
    {
      question: "Is zEdgeStorage free to use",
      answer: "zEdgeStorage currently has a free tier that is enough to get you started. You can upgrade anytime you need.",
      showOnGatewayCampaignPageToo: false,
    },
    {
      question: "Do you have refund policy?",
      answer:
        'Yes, we have a refund policy. Read more about it <a href="https://www.zedgehorizon.com/post/refund-and-dispute-policy-zedge-storage" target="_blank">here</a>.',
      showOnGatewayCampaignPageToo: true,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between py-16">
      <div className="flex flex-col px-8 lg:px-16 mb-8 items-start">
        <span className="text-foreground text-4xl mb-4">FAQs</span>
        <span className="text-base text-foreground/50 max-w-[20rem]">Explore our frequently asked questions and answers.</span>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center ">
        {questions.map((pair, index) => (
          <QuestionCard key={index} question={pair.question} answer={pair.answer} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
