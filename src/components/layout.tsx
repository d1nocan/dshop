import React from "react";
import Navbar from "./navbar";
type layoutProps = {
    children: React.ReactNode;
}

export default function Layout({children} : layoutProps){
    return(
    <>
      <Navbar />
      <div className="bg-base-200">
        {children}
      </div>
    </>)
}
