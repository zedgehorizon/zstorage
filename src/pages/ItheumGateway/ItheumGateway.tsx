import React, { useEffect } from "react";
import hands from "@assets/img/hands.png";
import folders from "@assets/img/folder-storage.png";
import { Link } from "react-router-dom";
import { Footer } from "@components/Layout/Footer";
import Faq from "../LandingPage/components/Faq";
import CaseStudies from "./components/CaseStudies";
import ItheumGatewayService from "../LandingPage/components/ItheumGatewayService";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks/account";
import whiteRectangle from "@assets/img/white-rectangle.png";
import zImage from "@assets/img/z-image.png";

const ItheumGateway = () => {
  const isLoggedIn = useGetIsLoggedIn();

  useEffect(() => {
    // if there are URL hash params like #solution, #pricing, #features, #gateway, let's detect that and scroll to the element
    const hash = window.location.hash;

    if (hash) {
      setTimeout(() => {
        const section = document.getElementById(hash.slice(1));
        if (section) {
          window.scrollTo({
            top: section.offsetTop,
            behavior: "smooth",
          });
        }
      }, 10);
    }
  }, [window.location.hash]);

  return (
    <div className="top-0 w-full h-full bg-background flex flex-grow flex-col items-center justify-start  ">
      <div id="hero" className="pt-16 relative flex items-center justify-center">
        <img src={zImage} className="absolute top-0 max-h-[35rem] object-cover mx-auto" alt="Background" />
        <div className="z-10 flex flex-col justify-center items-center h-full w-full">
          <span className="text-[2.5rem] 2xl:text-[3.5rem] text-accent uppercase text-center">
            Itheum Gateway <br />
            <span className="text-white">By</span> Zedge Storage
          </span>
          <span className="text-[1.4rem] text-center mt-5">
            Tokenizing Data is Complicated. <br />
            We can help you
          </span>
          <div className="mt-3 z-10">
            {(isLoggedIn && (
              <Link
                to={"/data-bunker"}
                className="scale-75 xl:scale-100 font-bold text-accent-foreground bg-accent rounded-full px-4 lg:px-20 py-5 text-xl flex justify-center">
                Access Your Data Bunker
              </Link>
            )) || (
              <button
                onClick={() => {
                  const section = document.getElementById("gateway");

                  if (section) {
                    window.scrollTo({
                      top: section.offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
                className="scale-75 xl:scale-100 font-bold text-accent-foreground bg-accent rounded-full  px-4 lg:px-20 py-5 text-xl flex justify-center">
                <p className="">Get Started Now</p>{" "}
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="solution" className="pt-16 lg:p-32 w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full xl:w-[60%] max-w-[40rem]  px-8 flex flex-col align-left gap-3">
          <span className="text-2xl">Tokenize Data is a highly valuable asset-class. But it's complex to achieve.</span>
          <span className="text-sm text-foreground/75">
            Tokenizing data into "digital assets" using blockchain technology is a complex and highly technical process. We have partnered with our technology
            partner Itheum to provide a seamless experience for tokenizing data.
          </span>
          <span className="text-sm text-foreground/75">
            We specialize in helping organizations, agencies, and individuals to tokenize any type of data, including AI models, documents, images, videos, and
            audio. Taking all the complexity out of the process.
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

      <div id="case-studies">
        <CaseStudies />
      </div>

      <div className="w-full flex flex-col items-center overflow-hidden">
        <div className="mt-8 flex flex-col justify-center items-center relative w-full h-full p-4 pt-16 xl:p-20">
          <img src={whiteRectangle} className="absolute top-0 left-0 w-full min-h-screen object-cover" alt="White Rectangle Background" />
          <div className="z-10 flex flex-col items-center">
            <img className="scale-75 lg:scale-100" src={folders} alt="Folders" />
            <span className="text-muted text-2xl lg:text-5xl w-[60%] mx-auto text-center">
              Your One-Stop-Shop
              <br /> for Data Tokenization Projects
            </span>
            <span className="text-base text-muted w-[50%] mx-auto text-center mt-4">
              From storage to tokenization, we provide you with all the tools you need to make your data tokenization projects a success.
            </span>
          </div>
        </div>
      </div>
      <div id="gateway" className="w-full flex flex-col items-center justify-center mt-10">
        <ItheumGatewayService />
      </div>

      <div id="contact" className="w-full flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center relative w-full p-4 pt-16 xl:p-20 md:w-[80%] text-center">
          <h2 className="text-4xl text-foreground text-center ">Let's Talk</h2>
          <div className="text-xl mb-4 mt-2">Want to to talk with someone before making a decision? We're here to help.</div>
          <span className="text-foreground/75 mb-4">
            We're here to help you with your data tokenization projects. Whether you're looking for a partner to help you tokenize your data, or are keen to
            explore and brainstorm some ideas. Send us an email and we'll organise a call.
          </span>
          <button
            className="bg-accent text-accent-foreground rounded-full px-4 py-2"
            onClick={() => {
              window.open("https://www.zedgehorizon.com/post/customer-support-contact-us-zedge-storage", "_blank");
            }}>
            Reach Out
          </button>
        </div>
      </div>

      <Faq />
      <Footer />
    </div>
  );
};

export default ItheumGateway;
