import { Popover, Transition } from "@headlessui/react";
import { trpc } from "@utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import Button from "./button";

export const UserPanel = () => {
    const { data: session } = useSession();
    const [code, setCode] = useState("");
    const { mutate, error } = trpc.code.use.useMutation();
    return (
        <>
            {session?.user ? (
                <Popover className="relative">
                    <Popover.Button>
                        <div className="relative z-40 mr-4 aspect-square w-12">
                            <Image
                                alt={session?.user?.name as string}
                                src={session?.user?.image as string}
                                layout="fill"
                                className="rounded-xl"
                                objectFit="contain"
                            />
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
                        <Popover.Panel className="absolute top-0 right-4 z-10 flex h-60 w-60 flex-col justify-between rounded-xl bg-neutral-700 text-neutral-100">
                            <p className="mt-3 ml-6 font-bold">{session.user.name}</p>
                            <p className="text-center font-semibold">Points: {session.user.points}</p>
                            <div className="relative -mt-4 flex flex-col justify-center text-center">
                                <p className="font-semibold">Code:</p>
                                <input
                                    title="Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="input mb-2 h-1/3 w-4/6"
                                />
                                <button type="button" onClick={() => mutate({ code: code })}>
                                    Redeem
                                </button>
                                {error && (
                                    <p className="absolute -bottom-5 top-auto mx-auto w-full text-red-500">
                                        {error.message === "NOT_FOUND" ? "Not Found" : "Already used"}
                                    </p>
                                )}
                            </div>
                            <Button type="primary" onClick={() => signOut()}>
                                Sign Out
                            </Button>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            ) : (
                <Button type="primary" className="mr-4" onClick={() => signIn()}>
                    Login
                </Button>
            )}
        </>
    );
};

export default UserPanel;
