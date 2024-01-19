import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

interface QuestionCardProps {
  question: string;
  answer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className=" w-[35rem] p-4 px-6 rounded-3xl border border-accent/50">
      <div className="flex justify-between">
        <h3 className="text-foreground">{question}</h3>
        {showAnswer ? (
          <Minus
            className="cursor-pointer text-accent"
            onClick={() => {
              setShowAnswer(false);
            }}
          />
        ) : (
          <Plus
            className="cursor-pointer text-accent"
            onClick={() => {
              setShowAnswer(true);
            }}
          />
        )}
      </div>
      {showAnswer && <div className="w-[90%] text-foreground/50"> {answer} </div>}
    </div>
  );
};

export default QuestionCard;
