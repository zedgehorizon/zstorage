import { queries } from "@testing-library/react";
import { XCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface IOption {
  image?: string;
  name: string;
  description?: string;
  action: () => void;
}

interface SelectOptionCardProps {
  title: string;
  description?: string;
  question?: string;
  options?: IOption[];
}

const SelectOptionCard: React.FC<SelectOptionCardProps> = (props) => {
  const { title, description, question, options } = props;
  return (
    <div className="flex flex-col z-2 w-[80%]   md:w-[55%] xl:w-[45%]  bg-muted rounded-2xl border border-accent/25  ">
      <div className="flex flex-row w-full rounded-2xl bg-gradient-to-r from-muted via-accent/50 to-muted pb-[1px]">
        <div className="flex-grow flex justify-center items-center bg-muted rounded-tl-2xl text-accent text-3xl font-medium py-8">
          <p>{title}</p>
        </div>
        <Link to={"/landing"} className=" bg-muted rounded-r-2xl  flex items-center pr-4">
          <XCircle className="w-6 h-6 text-foreground cursor-pointer" />
        </Link>
      </div>

      <div className="text-foreground text-center text-base py-6 ">{question}</div>
      <div className="flex flex-col gap-4 pb-16 items-center justify-center">
        {options &&
          options.map((option, index) => (
            <div
              key={index}
              onClick={() => option.action()}
              className="cursor-pointer hover:bg-accent/25 focus:bg-accent/75 w-[80%] p-4 bg-foreground/5  rounded-lg border border-accent/25 items-center gap-4 inline-flex">
              {option.image && (
                <div className=" w-12 h-12 p-3 bg-foreground  rounded-2xl  justify-center items-center inline-flex">
                  <img src={option.image}></img>
                </div>
              )}
              <span className="text-center text-foreground/75 text-base ">{option.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectOptionCard;
