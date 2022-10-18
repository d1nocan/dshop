import { Popover, Transition } from "@headlessui/react";
import { trpc } from "@utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "phosphor-react";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";

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
            <Popover className="relative mt-1 mr-4">
                <Popover.Button>
                    <div
                        className={`relative z-40 aspect-square w-12 rounded ${
                            status === "loading" && "animate-pulse bg-neutral-700"
                        }`}
                    >
                        {status === "authenticated" && (
                            <Image
                                alt={session?.user?.name as string}
                                src={session?.user?.image as string}
                                layout="fill"
                                className="rounded-xl"
                                objectFit="contain"
                            />
                        )}
                        {status === "unauthenticated" && (
                            <User size={30} weight="bold" className="mx-auto my-auto h-full dark:text-neutral-50" />
                        )}
                    </div>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-0 -translate-y-1/2 translate-x-1/2"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-0 -translate-y-1/2 translate-x-1/2"
                >
                    <Popover.Panel
                        className={`absolute -top-2 z-10 flex flex-col ${
                            status === "authenticated" ? "h-72" : "h-32"
                        } -right-4 w-60 justify-between rounded bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100`}
                    >
                        <p className="mt-5 ml-6 font-bold">{session?.user?.name || "You need to sign in"}</p>
                        {status === "authenticated" && (
                            <>
                                <p className="ml-6 font-semibold">Points: {session?.user?.points}</p>
                                <div className="relative -mt-2 flex flex-col justify-center text-center">
                                    <p className="font-semibold">Code:</p>
                                    <input
                                        title="Code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="input mb-2 h-1/3 w-4/6"
                                    />
                                    <button
                                        type="button"
                                        className="button secondary mx-auto w-24 scale-90 text-start outline"
                                        onClick={() => mutate({ code: code })}
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </>
                        )}
                        <button
                            type="button"
                            className="button primary mx-auto mb-2 w-2/3"
                            onClick={() => (status === "authenticated" ? signOut() : signIn())}
                        >
                            {status === "authenticated" ? "Sign Out" : "Sign In"}
                        </button>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </>
    );
};

export default UserPanel;
