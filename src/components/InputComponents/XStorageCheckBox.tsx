import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
type XStorageCheckBoxProps = {
  title: string;
  description: string;
  options: any[];
  descriptions: any[];
  setterFunction: (selectedOption: any) => void; // function to set in big component
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
      <b className="p-2 text-xl  font-medium dark:text-purple-800"> {props.title}</b>
      <b className="p-2 text-lg  font-medium  dark:text-blue-400">{props.description} </b>
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
              className="hidden peer"
            />{" "}
            <label
              htmlFor={`react-option-${title + "->" + index}`}
              className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700
               peer-checked:border-sky-500 hover:text-gray-600 dark:peer-checked:text-gray-300
                 peer-checked:text-gray-600
               peer-checked:bg-green-200
               hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              <div className="block">
                {/* add logo maybe */}
                <div className="w-full text-lg font-semibold">{title}</div>
                <div className="w-full text-sm"> {descriptions[index]}</div>
              </div>
            </label>{" "}
            <label htmlFor={`react-option-${title + "->" + index}`} className=" flex p-2 opacity-0 peer-checked:opacity-100 ">
              <CheckCircle className="  ml-auto" color="green"></CheckCircle>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
