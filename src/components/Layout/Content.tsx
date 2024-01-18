import React, { JSX } from "react";

type ContentProps = {
  children: JSX.Element;
};
export const Content: React.FC<ContentProps> = ({ children }) => {
  return <div className="flex flex-col justify-center items-center bg-background w-full flex-grow mx-auto z-0">{children}</div>;
};
