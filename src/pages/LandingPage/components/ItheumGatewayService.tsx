import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@libComponents/Button";
import { CheckCircle2, X, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@libComponents/Dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@libComponents/Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@libComponents/Popover";
import storageIllustration from "@assets/img/illustration-storage.png";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";

const ItheumGatewayService: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = useGetIsLoggedIn();

  const FeatureTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
    return (
      <>
        <div className="hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{children}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-sm text-white p-2 whitespace-pre-line">{content}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <span className="cursor-pointer">{children}</span>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-sm text-white p-2 whitespace-pre-line">{content}</p>
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  };

  const SubscriptionRenewalContent = () => (
    <p className="text-sm text-white p-2 whitespace-pre-line">
      As zEdge Storage and Itheum are decentralized tools, any data you have already produced and launched will continue to remain. But once your subscription
      is not renewed, then this may impact the performance of the streaming or download of your data. <br />
      <br />
      For example, if your users are listening to music that has been tokenized, these music streams may take longer to download as access is now deprioritized.
      It will still work, but during peak times, your data access may get deteriorated.
    </p>
  );

  return (
    <div className="flex flex-col px-4 lg:px-24">
      <h2 className="text-4xl text-foreground text-center">Itheum Gateway Service</h2>
      <h3 className="text-foreground/75 text-center">Extend your data storage with optional support for data tokenization</h3>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 py-16 px-4 lg:px-32">
        {/* Left Column - Description */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2 md:max-w-md">
          <img src={storageIllustration} alt="Storage Illustration" className="w-full max-w-md mx-auto" />
          <p className="text-foreground/75 text-center">
            The{" "}
            <a href="https://itheum.io" target="_blank" className="text-accent">
              Itheum protocol
            </a>{" "}
            is a blockchain technology layer that enables seamless tokenization of real-world data. From music playlists to large documents, video streams, and
            AI models, Itheum makes it possible to tokenize virtually any data type.
          </p>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-fit mx-auto">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Itheum Gateway Service</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8 p-0 hover:bg-accent/10">
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <div className="text-foreground/75">
                <p className="mb-4">
                  The itheum protocol is a blockchain technology layer that lets you tokenize any real world data seamlessly. For example, you can tokenize
                  music playlists (check out{" "}
                  <a href="https://sigmamusic.fm" target="_blank" className="text-accent">
                    sigmamusic.fm
                  </a>
                  ), large multi-page PDFs/books, video streams, spreadsheets, AI models and metadata and pretty much any other data.
                </p>
                <p className="mb-4">
                  To tokenize data, you first need to selfhost the data and this is where zedge storage Digital Data Bunkers help, but once your data is stored
                  you have to interact with the Itheum protocol to actually tokenize the data assets and data streams and then have the data downloadable or
                  streamable via the itheum protocol brokerage node infrastructure.
                </p>
                <p>
                  This whole process can be complex for non-technical users and can be daunting. This is where the Itheum Gateway service comes in, it's an
                  abstraction layer that simplifies your data tokenization and access jobs powered by Itheum. Once you subscribe, all you need to do is share
                  your data files and the complexity of tokenizing your data will be handled. You can receive data NFTs (tokenized version of your data) and
                  access to have your data "priority" streamed to your end users via Itheum's broker nodes.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Column - Pricing */}
        <div className="flex flex-col border border-muted-foreground/30 gap-2 p-4 rounded-xl text-muted-foreground/50 bg-muted w-full lg:w-1/2 max-w-md">
          <div className="flex flex-row justify-between">
            <span className="text-[10px] pb-2">GATEWAY SERVICE</span>
            <div className="mt-0 mr-0 bg-accent text-muted font-bold text-[10px] p-1 items-center justify-center">Limited Time Offer</div>
          </div>
          <span className="text-lg text-accent">Gateway Service</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              A single annual subscription for simplified data storage, tokenization and access to priority support to get started
            </span>
            <div className="hidden md:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-yellow-500 cursor-pointer hover:underline flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      What happens if I don't renew?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <SubscriptionRenewalContent />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <span className="text-xs text-yellow-500 cursor-pointer hover:underline flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    What happens if I don't renew?
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <SubscriptionRenewalContent />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-start items-end gap-1">
            <div className="text-5xl text-accent">$129</div>
            <span className="text-sm">per year</span>
            <div className="ml-2 text-sm text-accent line-through">$199</div>
          </div>
          <div className="w-[100%] bg-gradient-to-r from-muted via-foreground/50 to-muted pb-[1px] -z-1" />

          <ul className="font-thin text-sm text-accent">
            <li className="flex">
              <CheckCircle2 className="mr-2 scale-75 my-auto text-accent" />
              <FeatureTooltip
                content={`Same as PREMIUM STORAGE tier

Create and store data in bunkers with 1GB storage and bandwidth as part of your gateway subscription.`}>
                <span className="my-auto">1GB Storage</span>
              </FeatureTooltip>
            </li>
            <li className="flex">
              <CheckCircle2 className="mr-2 scale-75 my-auto text-accent" />
              <FeatureTooltip
                content={`Same as PREMIUM STORAGE tier

Create and store data in bunkers with 1GB storage and bandwidth as part of your gateway subscription.`}>
                <span className="my-auto">1GB Bandwidth / month</span>
              </FeatureTooltip>
            </li>
            <li className="flex">
              <CheckCircle2 className="mr-2 scale-75 my-auto text-accent" />
              <FeatureTooltip
                content={`Get dedicated human support for data storage and tokenization

Full support during onboarding, then reduced support as you become self-sufficient.`}>
                <span className="my-auto">Dedicated support for data tokenization</span>
              </FeatureTooltip>
            </li>
            <li className="flex">
              <CheckCircle2 className="mr-2 scale-75 my-auto text-accent" />
              <FeatureTooltip
                content={`Priority access to Itheum's broker nodes

Data NFTs can be streamed/downloaded by owners

We handle the complexity of staking, liveliness, and payments to ensure best service levels`}>
                <span className="my-auto">Priority data streaming</span>
              </FeatureTooltip>
            </li>
          </ul>

          <>
            {(isLoggedIn && (
              <Link to={"/data-bunker"}>
                <Button className="w-full bg-accent text-accent-foreground rounded-full">Your Data Assets</Button>
              </Link>
            )) || (
              <Link to={"/unlock?signup=gateway1"}>
                <Button className="w-full bg-accent text-accent-foreground rounded-full">Get Started for Free, Pay Later</Button>
              </Link>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ItheumGatewayService;
