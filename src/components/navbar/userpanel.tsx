import { useState, type FC, type ChangeEvent } from "react";
import { w } from "windstitch";
import { trpc } from "@utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "phosphor-react";
import { toast } from "react-hot-toast";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const contentStyles =
    "min-w-[200px] bg-neutral-50 dark:bg-neutral-800 rounded-md p-3 [box-shadow:'0px_10px_38px_-10px_rgba(22,23,24,0.35),_0px_10px_20px_-15px_rgba(22,23,24,0.2)'] motion-safe:";
const StyledContent = w(DropdownMenuPrimitive.Content, {
    className: contentStyles + " flex flex-col gap-1.5",
});
const StyledArrow = w(DropdownMenuPrimitive.Arrow, {
    className: "fill-neutral-200 dark:fill-neutral-800",
});

const Content: FC<DropdownMenuPrimitive.DropdownMenuContentProps> = ({ children, ...props }) => (
    <DropdownMenuPrimitive.Portal>
        <StyledContent {...props}>
            {children}
            <StyledArrow />
        </StyledContent>
    </DropdownMenuPrimitive.Portal>
);

const itemStyles =
    "mx-auto text-md font-semibold text-neutral-900 p-2 dark:text-neutral-50 leading-none items-center relative select-none data-[disabled]:text-violet-100 data-[disabled]:cursor-none";
const StyledItem = w(DropdownMenuPrimitive.Item, {
    className: itemStyles,
});
const StyledSeparator = w(DropdownMenuPrimitive.Separator, {
    className: "h-[1px] bg-violet-300 m-1",
});
const IconButton = w.button(
    "[all:unset] [font-family:inherit] rounded-full h-8 w-8 inline-flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-800",
);
export const UserPanel = () => {
    const { data: session, status } = useSession();
    const [code, setCode] = useState("");
    const { mutate } = trpc.code.use.useMutation({
        onError: (err) => {
            toast(err.message, {
                icon: "❌",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-800",
            });
        },
        onSuccess: () => {
            toast("Code redeemed!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-800",
            });
        },
    });
    return (
        <>
            <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                    <IconButton>
                        {status === "authenticated" && (
                            <Image
                                alt={session?.user?.name as string}
                                src={session?.user?.image as string}
                                width={44}
                                height={44}
                                className="my-2 rounded-xl"
                            />
                        )}
                        {status === "unauthenticated" && (
                            <User
                                size={30}
                                weight="bold"
                                className="mx-auto my-auto mt-2 ml-3 h-full rounded-xl text-neutral-50"
                            />
                        )}
                    </IconButton>
                </DropdownMenuPrimitive.Trigger>
                <Content sideOffset={5}>
                    <StyledItem as="h1">{session?.user?.name || "You need to sign in"}</StyledItem>
                    {status === "authenticated" && <StyledItem as="h2">Points: {session?.user?.points}</StyledItem>}
                    <StyledItem
                        as="button"
                        className="button primary mx-auto my-2 w-28 scale-90"
                        onClick={() => (status === "authenticated" ? signOut() : signIn())}
                    >
                        {status === "authenticated" ? "Sign Out" : "Sign In"}
                    </StyledItem>
                    {status === "authenticated" && (
                        <>
                            <StyledSeparator />
                            <StyledItem as="p">Code:</StyledItem>
                            <StyledItem
                                as="input"
                                value={code}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                                className="input -mt-1.5 flex h-1/2 w-4/6 font-light"
                            ></StyledItem>
                            <StyledItem
                                as="button"
                                className="button secondary mx-auto my-4 w-24 scale-90 text-start font-semibold outline"
                                onClick={() => mutate({ code: code })}
                            >
                                Redeem
                            </StyledItem>
                            <StyledSeparator />
                        </>
                    )}
                </Content>
            </DropdownMenuPrimitive.Root>
        </>
    );
};

export default UserPanel;
