import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <nav className="text-white text-xl">
      <div className="flex flex-row justify-left p-12 items-center h-20">
        <Link to={"/"} className="flex flex-row">
          <p className="text-xl text-left font-bold">zStorage</p>
        </Link>
      </div>
    </nav>
  );
};
