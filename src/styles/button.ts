import { cva } from "class-variance-authority";

export const buttonStyle = cva("text-center border py-2 px-4 flex rounded-lg duration-300", {
    variants: {
        theme: {
            primary: "bg-violet-600 border-violet-500",
            secondary:
                "bg-neutral-900 dark:bg-neutral-50 dark:text-neutral-50 border-neutral-900 dark:border-neutral-200 hover:text-neutral-50 dark:hover:text-neutral-900",
            danger: "bg-red-500 border-red-500",
            success: "bg-green-500 border-green-500",
            warning: "bg-yellow-500 border-yellow-500",
        },
        outline: {
            true: "bg-clip-text border-opacity-100 text-transparent hover:bg-clip-padding hover:text-neutral-100",
            false: "text-neutral-100 border-opacity-0",
        },
    },
    defaultVariants: {
        theme: "primary",
        outline: false,
    },
});
