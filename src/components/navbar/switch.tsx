import { Root, Thumb } from "@radix-ui/react-switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Switch = () => {
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <Root
            checked={currentTheme === "light"}
            onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Change Theme"
            className={`absolute left-auto right-20 my-auto mt-1 inline-flex h-6 w-12 shrink-0 scale-75 cursor-pointer rounded-full border-2 border-transparent bg-neutral-500 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 md:relative md:left-0 md:right-0 md:-ml-2.5 lg:ml-0`}
        >
            <span className="sr-only">Change Theme</span>
            <Thumb
                aria-hidden="true"
                className={`${
                    currentTheme === "light" ? "translate-x-6" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-50 shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
        </Root>
    );
};

export default Switch;
