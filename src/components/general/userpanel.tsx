import { Popover, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";

export const UserPanel = () => {
    const { data: session } = useSession();
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
                        <Popover.Panel className="absolute top-0 right-4 z-10 flex h-40 w-40 flex-col justify-between rounded-xl bg-neutral-700 text-neutral-100">
                            <p className="mt-3 ml-6 font-bold">{session.user.name}</p>
                            <p className="text-center font-semibold">Points: {session.user.points}</p>
                            <button type="button" className="btn-prm" onClick={() => signOut()}>
                                Sign Out
                            </button>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            ) : (
                <button
                    type="button"
                    className="mr-4 rounded-lg border border-violet-600 bg-violet-600 py-2 px-4 text-sm font-medium text-white duration-300 hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                    onClick={() => signIn()}
                >
                    Login
                </button>
            )}
        </>
    );
};

export default UserPanel;
