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
            <div className="relative mx-auto flex w-full flex-row flex-wrap items-center justify-between rounded-b-xl bg-neutral-300 bg-opacity-20 px-4 dark:bg-neutral-800 dark:bg-opacity-20 lg:px-10">
                <div className="order-1 mt-2 inline-flex flex-1 select-none flex-col justify-start sm:flex-row">
                    <div className="ml-4 cursor-default select-none text-2xl font-bold tracking-wide text-neutral-800 dark:text-neutral-100 md:mr-6">
                        <Link href="/" className="relative">
                            <span className="z-0 -ml-4 tracking-wide sm:ml-0">DShop</span>
                            <span className="absolute -right-0.5 -z-10 text-violet-500">DShop</span>
                        </Link>
                    </div>
                    <Switch
                        checked={theme}
                        onCheckedChange={setTheme}
                        aria-label="Change Theme"
                        className={`absolute left-auto right-20 my-auto mt-1 inline-flex h-6 w-12 shrink-0 scale-75 cursor-pointer rounded-full border-2 border-transparent bg-neutral-500 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 md:relative md:left-0 md:right-0`}
                    >
                        <span className="sr-only">Change Theme</span>
                        <Thumb
                            aria-hidden="true"
                            className={`${
                                !theme ? "translate-x-6" : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-50 shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                </div>
                <div className="order-3 mb-4 inline-flex flex-1 flex-shrink-0 basis-11/12 justify-center md:order-2 md:mb-0 md:basis-0">
                    <Links />
                </div>
                <div className="order-2 mt-2 inline-flex h-max flex-1 select-none justify-end md:order-3">
                    <UserPanel />
                </div>
            </div>
        </>
    );
}
