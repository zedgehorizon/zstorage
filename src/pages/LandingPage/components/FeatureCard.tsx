import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@libComponents/Card";
import { cn } from "@utils/functions";

interface FeatureCardProps {
  title: string;
  description: string;
  subDesc?: string;
  image?: string;
  logo: string;
  className?: string;
  cta?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  const { title, description, subDesc, image, logo, className, cta } = props;

  let ctaLink = "";
  let ctaText = "More";

  if (cta) {
    const ctaParts = cta.split("~");

    if (ctaParts.length === 2) {
      ctaLink = ctaParts[0];
      ctaText = ctaParts[1];
    } else {
      ctaLink = ctaParts[0];
    }
  }

  return (
    <Card className={cn("flex flex-col justify-start items-start bg-muted border-0 rounded-2xl", className)}>
      <div className="p-8 pt-12">
        <img className="mb-4 bg-foreground/10 p-3 rounded-2xl border-[1px] border-accent " src={logo}></img>
        <CardTitle className="mb-4 text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-foreground/75 max-w-[20rem] lg:max-w-[90%]">
          {description} {subDesc && <div className="text-xs mt-2">{subDesc}</div>}
          {cta && (
            <div className=" mt-2">
              <br />{" "}
              <a className="text-sm px-8 -mt-2 border border-accent bg-background rounded-full hover:shadow hover:shadow-accent" target="_blank" href={ctaLink}>
                {ctaText}
              </a>
            </div>
          )}
        </CardDescription>
      </div>
      <CardContent className="p-0 ">
        <img className="rounded-b-2xl" src={image}></img>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
