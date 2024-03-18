import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@utils/functions";

type XStorageCheckBoxProps = {
  title: string;
  description?: string;
  options: any[];
  descriptions?: any[];
  currentOption: any;
  setterFunction: (selectedOption: any) => void; // function to save in parent component
  disabled?: boolean[];
};

export const XStorageCheckBox: React.FC<XStorageCheckBoxProps> = (props) => {
  const { title, options, currentOption, description, descriptions, setterFunction, disabled } = props;
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (currentOption) setSelectedOption(currentOption);
  }, []);

  return (
    <div className="p-4 w-[70%] flex flex-col gap-6">
      <b className="font-thin text-2xl text-foreground"> {title}</b>
      {description && <div className="text-foreground/50">{description}</div>}
      {descriptions ? (
        <ul className="w-full gap-6 flex flex-col">
          {options.map((title: string, index) => (
            <li
              key={index}
              onClick={() => {
                if (disabled && disabled[index]) return;
                setSelectedOption(title);
                setterFunction(title);
              }}
              className={cn(`
          flex  cursor-pointer  
          bg-muted
          w-[100%] h-[10rem] rounded-lg border border-accent/25  p-8
          transition-all duration-300 transform
           ${disabled && disabled[index] ? "hover:cursor-not-allowed" : ""}  
          ${selectedOption === title ? "text-accent-foreground bg-accent" : ""}
        `)}>
              <div
                className={cn(
                  `w-6 h-6 rounded-lg border mt-1 border-accent/25 mr-4
                ${selectedOption === title ? "border-accent-foreground" : ""}`
                )}>
                <Check className={cn(`text-accent-foreground opacity-0 ${selectedOption === title ? "opacity-100" : ""}`)} />
              </div>
              <div className="flex flex-1 flex-col gap-2 ">
                <div className="flex justify-between">
                  <div className="text-xl font-normal  ">{title}</div>
                  <div className="w-[8rem] ml-auto">
                    {disabled && disabled[index] === true && (
                      <div className="text-center text-xs font-bold  text-accent-foreground bg-accent p-2"> Coming soon</div>
                    )}
                  </div>
                </div>
                {descriptions && descriptions[index] && (
                  <div className={cn(`w-full text-base  text-foreground/75 ${selectedOption === title ? "text-accent-foreground" : ""}`)}>
                    {descriptions[index]}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {options.map((title: string, index) => (
            <div
              key={index}
              onClick={() => {
                if (disabled && disabled[index]) return;
                setSelectedOption(title);
                setterFunction(title);
              }}
              className={cn(`
          flex  cursor-pointer  
          bg-muted
          w-[100%] h-[6rem] rounded-lg border border-accent/25  p-8
          transition-all duration-300 transform
           ${disabled && disabled[index] ? "hover:cursor-not-allowed" : ""}  
          ${selectedOption === title ? "text-accent-foreground bg-accent" : ""}
        `)}>
              <div
                className={cn(
                  `w-6 h-6 rounded-lg border mt-1 border-accent/25 mr-4
                ${selectedOption === title ? "border-accent-foreground" : ""}`
                )}>
                <Check className={cn(`text-accent-foreground opacity-0 ${selectedOption === title ? "opacity-100" : ""}`)} />
              </div>
              <div className="flex flex-1 flex-col gap-2 ">
                <div className="flex justify-between">
                  <div className="text-xl font-normal  ">{title}</div>
                  {disabled && disabled[index] === true && (
                    <div className="w-[8rem] ml-auto">
                      <div className="text-center text-xs font-bold  text-accent-foreground bg-accent p-2"> Coming soon</div>
                    </div>
                  )}
                </div>
                {descriptions && descriptions[index] && (
                  <div className={cn(`w-full text-base  text-foreground/75 ${selectedOption === title ? "text-accent-foreground" : ""}`)}>
                    {descriptions[index]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
