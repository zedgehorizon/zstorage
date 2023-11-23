import { FC, ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const ToolTip: FC<Props> = ({ children, tooltip }): JSX.Element => {
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
      className="group relative inline-block">
      {children}
      {tooltip ? (
        <div className="bg-black/60 rounded-3xl  absolute bottom-0 -ml-24 flex flex-col items-center hidden mb-6 group-hover:flex">
          <div className=" w-[300px] h-[200px] relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gradient-to-b from-sky-500/20 via-[#300171]/20 to-black/20 rounded-3xl shadow-xl shadow-lg">
            <div className="flex-col flex">
              <p>1. Login to your DNS server or domain register</p>
              <p>2. Add or edit DNS records described below </p>
              <p className="text-xl">A Record:</p>
              <p>Hostname : yourdomain.com</p>
              <p className="text-xl">TXT Record :</p>
              <p>Hostname : _dnslink.yourdomain.com</p>
              <p>Value : ... </p>
              <p className="text-xl bold">Ask how to make it</p>
            </div>
          </div>
          <div className="w-3 h-3 -ml-2 -mt-2 rotate-45 bg-gradient-to-b from-sky-500 via-[#300171]  to-black  "></div>
        </div>
      ) : // <div className="w-[300px] h-[200px]">

      //   <span
      //     ref={tooltipRef}
      //     className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-black-500/50 text-white p-1 rounded absolute bottom-full mt-2 whitespace-nowrap">
      //     {tooltip}
      //   </span>
      // </div>
      null}
    </div>
  );
};

export { ToolTip };
