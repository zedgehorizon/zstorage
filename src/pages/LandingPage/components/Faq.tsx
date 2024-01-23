import React from "react";
import QuestionCard from "./QuestionCard";

const Faq: React.FC = () => {
  const questions = [
    {
      question: "What is zStorage?",
      answer:
        "zStorage is a decentralized storage solution that allows you to store data on IPFS, Arweave or centralised storage like AWS. It also allows you to upgrade your data at any time.",
    },
    {
      question: "What is zStorage?",
      answer:
        "zStorage is a decentralized storage solution that allows you to store data on IPFS, Arweave or centralised storage like AWS. It also allows you to upgrade your data at any time.",
    },
    {
      question: "What is zStorage?",
      answer:
        "zStorage is a decentralized storage solution that allows you to store data on IPFS, Arweave or centralised storage like AWS. It also allows you to upgrade your data at any time.",
    },
    {
      question: "What is zStorage?",
      answer:
        "zStorage is a decentralized storage solution that allows you to store data on IPFS, Arweave or centralised storage like AWS. It also allows you to upgrade your data at any time.",
    },
    {
      question: "What is zStorage?",
      answer:
        "zStorage is a decentralized storage solution that allows you to store data on IPFS, Arweave or centralised storage like AWS. It also allows you to upgrade your data at any time.",
    },
  ];
  return (
    <div className="flex justify-between py-16">
      <div className="flex flex-col px-16">
        <span className="text-foreground text-4xl mb-4">FAQs</span>
        <span className="text-base text-foreground/50 max-w-[20rem]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {questions.map((pair, index) => (
          <QuestionCard key={index} question={pair.question} answer={pair.answer} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
