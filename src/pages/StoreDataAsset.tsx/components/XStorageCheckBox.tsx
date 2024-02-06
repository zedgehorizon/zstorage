import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../utils/utils";

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
  const { options, currentOption, description, descriptions, setterFunction, disabled } = props;

  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (currentOption) setSelectedOption(currentOption);
  }, []);
  //TODO think about a new way of doing this using a grid maybe
  return (
    <div className="p-4 w-[70%] flex flex-col gap-6">
      <b className="font-thin text-2xl text-foreground  "> {props.title}</b>
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

              {/* <input
              type="radio"
              name={`radio-group-${props.title}`}
              id={`react-option-${title + "->" + index}`}
              value={title}
              onChange={handleRadioChange}
              checked={selectedOption === title}
              className={"hidden peer"}
              disabled={disabled && disabled[index]}
            />
            <label
              htmlFor={`react-option-${title + "->" + index}`}
              className={cn(`
              flex gap-4 cursor-pointer  
              bg-muted
              w-[100%] h-[10rem]  rounded-lg border border-accent/25  p-8
              transition-all duration-300 transform
              peer-checked:text-accent-foreground peer-checked:bg-accent 
              ${disabled && disabled[index] ? "hover:cursor-not-allowed" : ""}  
            `)}>
              <div className="flex flex-col gap-2 ">
                <div className="text-2xl font-thin ">{title}</div>
                <div className="w-full text-lg font-thin text-foreground/75 peer-checked:text-accent-foreground"> {descriptions[index]}</div>
              </div>
              <div className="w-[10rem]">
                {disabled && disabled[index] === true && (
                  <div className="text-center text-xs font-bold px-2 text-accent-foreground bg-accent p-2"> Coming soon</div>
                )}
              </div>
            </label>
            <label
              htmlFor={`react-option-${title + "->" + index}`}
              className={cn(
                "cursor-pointer z-2 w-6 h-6 rounded-lg border opacity-0 peer-checked:opacity-100 mt-1 border-accent/25 peer-checked:border-2 peer-checked:border-accent-foreground "
              )}>
              <Check className="text-accent-foreground" />
            </label> */}
              {/* <label
              htmlFor={`react-option-${title + "->" + index}`}
              className={cn(`
              w-[60%] h-[30rem] bg-muted rounded-lg border border-accent/25  p-8
              transition-all duration-300 
              transform  
              ${disabled && disabled[index] ? "hover:cursor-not-allowed bg-gray-400/1 text-gray-300" : ""}  
            `)}>
              <ToolTip tooltip={disabled && disabled[index] ? "Coming soon" : ""}>
                <div className="text-lg font-semibold">{title}</div>
                <div className="w-full text-sm text-foreground/50 "> {descriptions[index]}</div>
              </ToolTip>
            </label> */}

              {/* <label htmlFor={`react-option-${title + "->" + index}`} className=" flex p-2 opacity-0 peer-checked:opacity-100 ">
              <CheckCircle className="ml-auto" color="green"></CheckCircle>
            </label> */}
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
