import { useState, type FC, type ChangeEvent, type ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { trpc } from "@utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "phosphor-react";
import { toast } from "react-hot-toast";
import { Root, Trigger, Content, Arrow, Separator } from "@radix-ui/react-dropdown-menu";

const ContentStyles = cva(
    "min-w-[200px] z-50 bg-neutral-50 dark:bg-neutral-800 rounded-md p-3 [box-shadow:'0px_10px_38px_-10px_rgba(22,23,24,0.35),_0px_10px_20px_-15px_rgba(22,23,24,0.2)'] motion-safe:",
);
const ContentStyle = cva(ContentStyles() + " flex flex-col gap-1.5");

const ArrowStyle = cva("fill-neutral-200 dark:fill-neutral-800");

const ItemStyles = cva(
    "mx-auto text-md font-semibold text-neutral-900 p-2 dark:text-neutral-50 leading-none items-center relative select-none data-[disabled]:text-violet-100",
);

const IconButtonStyle = cva(
    "[all:unset] [font-family:inherit] rounded-full h-8 w-8 inline-flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-800",
);

const SeperatorStyle = cva("h-[1px] bg-violet-300 m-1");

const Contents: FC<ComponentProps<typeof Content>> = ({ children, ...props }) => (
    <Content className={ContentStyle()} {...props}>
        {children}
        <Arrow className={ArrowStyle()} />
    </Content>
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
            <Root>
                <Trigger asChild>
                    <button type="button" className={IconButtonStyle()}>
                        {status === "authenticated" && (
                            <Image
                                alt={session?.user?.name as string}
                                src={session?.user?.image as string}
                                width={44}
                                height={44}
                                className="mb-2 rounded-xl"
                            />
                        )}
                        {(status === "unauthenticated" || status === "loading") && (
                            <User
                                size={44}
                                weight="bold"
                                className="mx-auto my-auto h-full rounded-xl pb-2 text-neutral-50"
                            />
                        )}
                    </button>
                </Trigger>
                <Contents sideOffset={5}>
                    <h1 className={ItemStyles()}>{session?.user?.name || "You need to sign in"}</h1>
                    {status === "authenticated" && <h2 className={ItemStyles()}>Points: {session?.user?.points}</h2>}
                    <button
                        type="button"
                        className={ItemStyles() + " button primary mx-auto my-2 w-28 scale-90"}
                        onClick={() => (status === "authenticated" ? signOut() : signIn())}
                    >
                        {status === "authenticated" ? "Sign Out" : "Sign In"}
                    </button>
                    {status === "authenticated" && (
                        <>
                            <Separator className={SeperatorStyle()} />
                            <p className={ItemStyles()}>Code:</p>
                            <input
                                value={code}
                                title="Enter code"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                                className={ItemStyles() + " input -mt-1.5 flex h-1/2 w-4/6 font-light"}
                                disabled={false}
                            />
                            <button
                                type="button"
                                className={
                                    ItemStyles() +
                                    " button secondary mx-auto my-4 w-24 scale-90 text-start font-semibold outline"
                                }
                                onClick={() => mutate({ code: code })}
                            >
                                Redeem
                            </button>
                            <Separator className={SeperatorStyle()} />
                        </>
                    )}
                </Contents>
            </Root>
        </>
    );
};

export default UserPanel;
