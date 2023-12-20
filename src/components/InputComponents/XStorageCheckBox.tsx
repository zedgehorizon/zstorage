import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ToolTip } from "../../libComponents/Tooltip";

type XStorageCheckBoxProps = {
  title: string;
  description: string;
  options: any[];
  descriptions: any[];
  setterFunction: (selectedOption: any) => void; // function to save in parent component
  disabled?: boolean[];
};

export const XStorageCheckBox: React.FC<XStorageCheckBoxProps> = (props) => {
  const { options, descriptions, setterFunction } = props;

  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (event: any) => {
    const newSelectedOption = event.target.value;
    setSelectedOption(newSelectedOption);
    setterFunction(newSelectedOption); // Call the setterFunction to update the state in the parent component
  };

  return (
    <div className="w-[80%] z-2 p-4 flex flex-col bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl hover:shadow-sky-500/50  ">
      <b className="p-2 text-xl font-medium dark:text-purple-800"> {props.title}</b>
      <b className="p-2 text-lg font-medium dark:text-blue-400">{props.description} </b>
      <ul className="grid w-full gap-6 md:grid-cols-3">
        {options.map((title: string, index) => (
          <li key={index} className=" relative ">
            <input
              type="radio"
              name={`radio-group-${props.title}`}
              id={`react-option-${title + "->" + index}`}
              value={title}
              onChange={handleRadioChange}
              checked={selectedOption === title}
              className={"hidden peer "}
              disabled={props.disabled && props.disabled[index]}
            />
            <label
              htmlFor={`react-option-${title + "->" + index}`}
              className={twMerge(`
              inline-flex items-center justify-center w-full h-[80%] p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer 
              peer-checked:border-green-600 peer-checked:text-gray-600 peer-checked:bg-green-200 
              hover:text-gray-600 hover:bg-green-100 hover:scale-105
              transition-all duration-300 
              transform  
              ${props.disabled && props.disabled[index] ? "hover:cursor-not-allowed bg-gray-400/1 text-gray-300" : ""}  
            `)}>
              <ToolTip tooltip={props.disabled && props.disabled[index] ? "Coming soon" : ""}>
                <div className=" text-lg font-semibold">{title}</div>
                {/* <div className="w-full text-sm hidden"> {descriptions[index]}</div> */}
              </ToolTip>
            </label>
            <label htmlFor={`react-option-${title + "->" + index}`} className=" flex p-2 opacity-0 peer-checked:opacity-100 ">
              <CheckCircle className="ml-auto" color="green"></CheckCircle>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
