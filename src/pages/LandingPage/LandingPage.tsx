import React from "react";
import vault from "../../assets/img/illustration-vault.png";
import hands from "../../assets/img/hands.png";
import folders from "../../assets/img/folder-storage.png";
import { Link } from "react-router-dom";
import KeyFeatues from "./components/KeyFeatures";
import { Footer } from "../../components/Layout/Footer";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import UseCase from "./components/UseCase";
import Testimonials from "./components/Testimonials";
import avatar from "../../assets/logo/Avatar.png";
import companyLogo from "../../assets/logo/Black.png";
import { useGetAccount, useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";

const testimonialsData = [
  {
    userName: "John Doe",
    rating: 4,
    occupation: "Software Engineer",
    avatar: avatar,
    companyLogo: companyLogo,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  // {
  //   userName: "Jane Smith",
  //   rating: 5,
  //   occupation: "Product Manager",
  //   avatar: avatar,
  //   companyLogo: companyLogo,
  //   feedback: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  // },
  // {
  //   userName: "Alex Johnson",
  //   rating: 3,
  //   occupation: "UX Designer",
  //   avatar: avatar,
  //   companyLogo: companyLogo,
  //   feedback: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  // },
];

const LandingPage: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <div className="top-0 w-full  h-full bg-background flex flex-grow flex-col items-center justify-start  ">
      <div className="min-w-[60%] min-h-[25rem] bg-z-image bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center">
        <div className="h-[60%]  flex flex-col justify-center items-center">
          <span className="text-[2.5rem] 2xl:text-[3.5rem] text-accent uppercase">Digital Storage Bunkers</span>
          <span className="text-[2rem] 2xl:text-[3rem] ">For your most vital data</span>
          <div className="mt-3">
            {(isLoggedIn && (
              <Link to={"/start"} className="font-bold text-accent-foreground bg-accent rounded-full px-8 py-2 flex justify-center">
                Manage Data Assets
              </Link>
            )) || (
              <Link to={"/unlock"} className="font-bold text-accent-foreground bg-accent rounded-full px-8 py-2 flex justify-center">
                <p className="">Get Started</p>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="-mt-12 z-2  ">
        <img src={vault}></img>
      </div>
      <div id="solution" className="p-32 w-full flex items-center justify-center">
        <div className="w-[60%] max-w-[40rem] px-8 flex flex-col allign-left gap-3">
          <span className="text-foreground/75 uppercase">ZStorage Solution</span>
          <span className="text-2xl">Your 'Plan Z' for Data Storage</span>
          <span className="text-sm text-foreground/75">
            You may have a plan A, B, C... to protect our most vital data, but the attack and censorship vectors for all these plans are the same.
          </span>
          <span className="text-sm text-foreground/75">
            Safeguarding your vital data requires a "new strategy." ZStorage offers a "Plan Z" solution that works alongside your existing storage plans. A
            seamless interface allows you to access distributed storage while ensuring sovereign encryption, creating digital data bunkers as your last line of
            defense.
          </span>
          <div>
            {(isLoggedIn && (
              <Link to={"/start"} className=" max-w-[15rem] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
                Manage Data Assets
              </Link>
            )) || (
              <Link
                to={"/unlock"}
                className="w-[50%] max-w-[10rem] font-bold text-accent-foreground bg-accent rounded-full px-4 py-2 flex items-center justify-center">
                <p className="">Get Started</p>{" "}
              </Link>
            )}
          </div>
        </div>
        <div>
          <img src={hands}></img>
        </div>
      </div>
      <UseCase />
      <div id="features"></div>
      <KeyFeatues />
      <div className="w-full h-full bg-background flex flex-col items-center pb-16">
        <div className="  mt-8 flex flex-col justify-center items-center w-full h-screen bg-top bg-white-rectangle bg-cover bg-no-repeat bg-center">
          <img className="scale-75 lg:scale-100" src={folders}></img>
          <span className=" text-muted text-5xl w-[60%] mx-auto text-center">
            Automative Toolkit
            <br /> for your Data Storage
          </span>
          <span className="text-base text-muted w-[50%] mx-auto text-center">
            Itheum protocol is providing a seamless and secure way to self host data and for generating a Data Stream that can be.
          </span>{" "}
        </div>
      </div>
      <div id="pricing"></div>
      <Pricing />
      <div id="testimonials"></div>
      <Testimonials testimonials={testimonialsData} />
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPage;
