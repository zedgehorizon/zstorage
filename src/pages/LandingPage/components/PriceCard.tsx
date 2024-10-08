import { CheckCircle2 } from "lucide-react";
import React from "react";
import { Button } from "@libComponents/Button";
import { cn } from "@utils/functions";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import { Link } from "react-router-dom";

interface PriceCardProps {
  title: string;
  price: string;
  description?: string;
  plan?: string;
  features: string[];
  buttonText?: string;
}

const PriceCard: React.FC<PriceCardProps> = (props) => {
  const isLoggedIn = useGetIsLoggedIn();
  const { title, price, features, plan, description } = props;
  const colorClass = plan === "PREMIUM" ? "text-accent" : "text-foreground";

  return (
    <div
      className={cn(
        `flex flex-col border border-muted-foreground/30 gap-2 p-4 rounded-xl  text-muted-foreground/50 bg-muted w-full h-full max-w-[16rem] max-h-[30rem] 
        ${plan === "BASIC" ? "border-accent" : ""}`
      )}>
      <div className="flex flex-row justify-between">
        <span className="text-[10px] pb-2">{plan} STORAGE</span>
        {plan === "BASIC" && <div className="mt-0 mr-0 bg-accent text-muted font-bold text-[10px] p-1 items-center justify-center">Try It Today</div>}
      </div>
      <span className={cn(colorClass, "text-lg")}>{title}</span>
      <span className="text-sm  ">{description}</span>
      <div className="flex justify-start items-end gap-1">
        {price === "Custom" ? (
          <div className={cn(colorClass, "text-5xl")}>{price}</div>
        ) : (
          <>
            <div className={cn(colorClass, "text-5xl")}>${price} </div> <span className="text-sm">per month</span>
          </>
        )}
      </div>
      <div className="w-[100%] bg-gradient-to-r from-muted via-foreground/50 to-muted pb-[1px] -z-1" />

      <ul className={cn(colorClass, "font-thin text-sm ")}>
        {features.map((feature, index) => (
          <li className="flex" key={index}>
            <CheckCircle2 className={cn(colorClass, "mr-2 scale-75 my-auto")} />
            <span className="my-auto">{feature}</span>
          </li>
        ))}
      </ul>
      {(plan === "BASIC" && (
        <Button className={cn(`ml-0 border px-16 border-foreground w-[50%] rounded-full ${plan === "BASIC" ? "bg-accent border-0 text-muted" : ""}`)}>
          <>
            {(isLoggedIn && <Link to={"/data-bunker"}>Data Assets</Link>) || (
              <Link to={"/unlock"}>
                <p className="">Get Started</p>
              </Link>
            )}
          </>
        </Button>
      )) || <div className="h-10">&nbsp;</div>}
    </div>
  );
};

export default PriceCard;
