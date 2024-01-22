import React from "react";

interface IStoreDataOption {
  title: string;
  description?: string;
}

interface StoreDataOptionCardProps {
  title: string;
  options: IStoreDataOption[];
  setterFunction: (optionIndex: number) => void;
}

const StoreDataOptionCard: React.FC<StoreDataOptionCardProps> = (props) => {
  const { title, options, setterFunction } = props;

  return (
    <div className="flex flex-col">
      <span className="text-2xl">{title}</span>
      <div className="flex flex-col">
        {options.map((option, index) => (
          <div></div>
        ))}
      </div>
    </div>
  );
};

export default StoreDataOptionCard;
