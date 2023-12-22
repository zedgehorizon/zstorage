import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../../libComponents/Card";
import { cn } from "../../utils/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
  logo: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  const { title, description, image, logo, className } = props;

  return (
    <Card className={cn("flex flex-col justify-start items-start gap-12 bg-muted border-0 rounded-2xl", className)}>
      <div className="gap-8 p-6">
        <img className="bg-foreground/10 p-3 rounded-2xl border-[1px] border-accent " src={logo}></img>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-foreground/75 max-w-[15rem]">{description}</CardDescription>
      </div>
      <CardContent className="p-0 ">
        <img className=" rounded-b-2xl" src={image}></img>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
