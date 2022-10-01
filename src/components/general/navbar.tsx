import { Switch } from "@headlessui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { env } from "src/env/client.mjs";

const DynamicLinks = dynamic(() => import("./links"));

const DynamicUserPanel = dynamic(() => import("./userpanel"));

const DynamicLink = dynamic(() => import("next/link"));

export default function Navbar() {
    const [theme, setTheme] = useState(false); // false = light, true = dark
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme(true);
        }
    }, []);
    useEffect(() => {
        theme ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
    }, [theme]);
    return (
        <>
            <div className="bg-neutral text-neutral-content relative mx-auto flex h-16 w-11/12 flex-wrap items-center justify-between rounded-b-xl bg-neutral-800">
                <div className="inline-flex flex-1 justify-start">
                    <DynamicLinks />
                    <Switch
                        checked={theme}
                        onChange={setTheme}
                        aria-label="Change Theme"
                        className={`${
                            theme ? "bg-neutral-100" : "bg-neutral-900"
                        } relative my-auto ml-2 inline-flex h-6 w-12 shrink-0 scale-75 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Change Theme</span>
                        <span
                            aria-hidden="true"
                            className={`${
                                !theme ? "translate-x-6 " : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-50 shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-neutral-900`}
                        />
                    </Switch>
                </div>
                <div className="inline-flex flex-1 flex-shrink-0 items-center">
                    <div className="mx-auto cursor-default text-2xl font-black uppercase tracking-wide text-neutral-100">
                        <DynamicLink href="/">
                            <span>{env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}</span>
                        </DynamicLink>
                    </div>
                </div>
                <div className="inline-flex flex-1 justify-end">
                    <DynamicUserPanel />
                </div>
            </div>
        </>
    );
}
