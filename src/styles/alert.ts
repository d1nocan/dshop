import { cva } from "class-variance-authority";

export const alertStyle = cva("p-4 text-neutral-100 rounded-xl min-w-[10rem] max-w-xs max-h-20 mx-auto mt-10", {
    variants: {
        theme: {
            info: "bg-blue-500",
            error: "bg-red-500",
            success: "bg-green-500",
            warning: "bg-yellow-500",
            primary: "bg-violet-500",
            secondary: "bg-neutral-900 dark:bg-neutral-200 dark:text-neutral-900",
        },
    },
});
