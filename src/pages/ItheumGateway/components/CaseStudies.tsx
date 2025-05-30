import React from "react";
import caseStudyTeslaverse from "@assets/img/case-study-teslaverse.png";
import caseStudyCityHall from "@assets/img/case-study-city-hall.png";
import caseStudyDeepForest from "@assets/img/case-study-deep-forest.png";
import caseStudySigmaMusic from "@assets/img/case-study-sigma-music.png";

const CaseStudies: React.FC = () => {
  return (
    <div className=" flex flex-col items-center justify-center">
      <span className="text-foreground text-4xl ">Case Studies</span>
      <span className="text-foreground text-md mb-8 text-center md:text-left">
        Here are some recent projects that launched tokenized data projects using the Itheum Gateway service
      </span>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2">
        <div className="w-full h-[24rem] md:h-[32rem] flex flex-col">
          <div className="flex rounded-t-3xl bg-muted items-center justify-center">
            <img className="" src={caseStudyTeslaverse} alt="Storage Illustration" />
          </div>
          <div className="bg-foreground flex flex-col items-center justify-center rounded-b-3xl pb-4">
            <span className="font-semibold text-center p-2 text-xl text-accent-foreground">Nikola Tesla Memorabilia</span>
            <a href="https://nft.ici.ro/teslaverse" target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
              View project
            </a>
          </div>
        </div>
        <div className="w-full h-[24rem] md:h-[32rem] flex flex-col">
          <div className="flex rounded-t-3xl bg-muted items-center justify-center">
            <img className="" src={caseStudyCityHall} alt="Real World Illustration" />
          </div>
          <div className="bg-foreground flex flex-col items-center justify-center rounded-b-3xl pb-4">
            <span className="font-semibold text-center p-2 text-xl text-accent-foreground">City Hall Archives</span>
            <a href="https://nft.ici.ro/city-halls-guide" target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
              View project
            </a>
          </div>
        </div>
        <div className="w-full h-[24rem] md:h-[32rem] flex flex-col">
          <div className="flex rounded-t-3xl bg-muted items-center justify-center">
            <img className="" src={caseStudyDeepForest} alt="Real World Illustration" />
          </div>
          <div className="bg-foreground flex flex-col items-center justify-center rounded-b-3xl pb-4">
            <span className="font-semibold text-center p-2 text-xl text-accent-foreground">Deep Forest Album Launch</span>
            <a href="https://nft.ici.ro/ethereal-echoes" target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
              View project
            </a>
          </div>
        </div>
        <div className="w-full h-[24rem] md:h-[32rem] flex flex-col">
          <div className="flex rounded-t-3xl bg-muted items-center justify-center">
            <img className="" src={caseStudySigmaMusic} alt="Real World Illustration" />
          </div>
          <div className="bg-foreground flex flex-col items-center justify-center rounded-b-3xl pb-4">
            <span className="font-semibold text-center p-2 text-xl text-accent-foreground">Sigma Music App</span>
            <a href="https://sigmamusic.fm/" target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
              View project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
