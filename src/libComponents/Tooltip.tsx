import { FC, ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
  tooltipBox?: JSX.Element;
}

const ToolTip: FC<Props> = ({ children, tooltip, tooltipBox }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();

        tooltipRef.current.style.left = clientX - left + "px";
      }}
      className="group relative inline-block ">
      {children}
      {tooltip === "" ? (
        <div className="bg-black rounded-3xl  absolute bottom-0 -ml-24 flex flex-col items-center hidden mb-6 group-hover:flex">
          {tooltipBox}
          <div className="w-3 h-3 -ml-2 -mt-2 rotate-45 bg-gradient-to-b from-sky-500 via-[#300171]  to-black  "></div>
        </div>
      ) : (
        <span className="bg-black mx-auto invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-black-500/50 text-white p-1 border-2 border-sky-800 rounded absolute bottom-full mt-2 whitespace-nowrap">
          {tooltip}
        </span>
      )}
    </div>
  );
};

export { ToolTip };
