import { cva } from "class-variance-authority";

export const inputStyle = cva(
    "form-input dark:bg-neutral-900 h-10 rounded-xl text-center mx-auto focus:ring-violet-500 focus:ring-1 focus:border-violet-500",
    {
        variants: {
            size: {
                sm: "w-32",
                md: "w-40",
                lg: "w-48",
                xl: "w-60",
            },
        },
        defaultVariants: {
            size: "md",
        },
    },
);

export const textAreaStyle = cva(
    "form-textarea w-full mx-auto rounded-xl dark:bg-neutral-900 dark:text-neutral-100 focus:ring-violet-500 focus:ring-1 focus:border-violet-500",
);

export const checkboxStyle = cva(
    "rounded duration-300 dark:bg-neutral-900 text-neutral-100 dark:text-neutral-900 bg-violet-400 checked:focus:bg-violet-500",
);

export const inputAreaStyle = cva("flex flex-col w-full min-w-[10em] max-w-[15em] mx-auto my-2 gap-2 text-center");
