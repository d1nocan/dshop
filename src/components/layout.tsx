import React, { useEffect, useState } from "react";
import Moon from "../../public/moon.svg";
import Sun from "../../public/sun.svg";
import Navbar from "./navbar";
type layoutProps = {
    children: React.ReactNode;
}
export default function Layout({children} : layoutProps){
  const [theme, setTheme] = useState("");
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);
  useEffect(() => {
    theme === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [theme]);
    return(<div className="flex flex-col overflow-auto bg-neutral-100 dark:bg-neutral-900">
      <Navbar />
        <button type="button" className="dark:text-neutral-50 text-neutral-900 absolute p-4 z-50 scale-90" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
        </button>
      <div className="children">
        {children}
      </div>
    </div>)
}
