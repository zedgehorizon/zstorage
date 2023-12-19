import React from "react";

interface SelectionListProps {
  items: string[];
}

const SelectionList: React.FC<SelectionListProps> = ({ items }) => {
  return (
    <>
      <b className=" py-2 text-xl font-medium"> Let’s update your data! Here is what you wanted to do... </b>

      <div className="flex flex-row gap-4 mb-4">
        {items.map((item) => {
          if (item)
            return (
              <span className="w-32 border-2 text-bold border-blue-400 bg-blue-900 text-blue-400 text-center text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {item}
              </span>
            );
        })}
      </div>
    </>
  );
};

export default SelectionList;
