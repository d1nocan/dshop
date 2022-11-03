import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Root as Switch, Thumb } from "@radix-ui/react-switch";

const Links = dynamic(() => import("./links"));

const UserPanel = dynamic(() => import("./userpanel"));

const Link = dynamic(() => import("next/link"));

export default function Navbar() {
    const [theme, setTheme] = useState(true); // false = light, true = dark
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setTheme(false);
        }
    }, []);
    useEffect(() => {
        theme ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
    }, [theme]);
    return (
        <>
            <div className="relative mx-auto flex h-16 w-11/12 flex-wrap items-center justify-between rounded-b-xl bg-neutral-800">
                <div className="inline-flex flex-1 select-none justify-start">
                    <div className="mx-6 cursor-default select-none text-2xl font-black uppercase tracking-wide text-neutral-100">
                        <Link href="/">
                            <span>DSHOP</span>
                        </Link>
                    </div>
                    <Switch
                        checked={theme}
                        onCheckedChange={setTheme}
                        aria-label="Change Theme"
                        className={`${
                            theme ? "bg-neutral-900" : "bg-neutral-100"
                        } relative my-auto ml-2 inline-flex h-6 w-12 shrink-0 scale-75 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Change Theme</span>
                        <Thumb
                            aria-hidden="true"
                            className={`${
                                !theme ? "translate-x-6 bg-neutral-900" : "translate-x-0 bg-neutral-50"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                </div>
                <div className="inline-flex flex-1 flex-shrink-0 items-center">
                    <Links />
                </div>
                <div className="inline-flex flex-1 select-none justify-end">
                    <UserPanel />
                </div>
            </div>
        </>
    );
}
