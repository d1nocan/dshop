import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Role } from "@prisma/client";
import { env } from "src/env/client.mjs";
import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import NextLink from "./link";

export default function Navbar() {
    const { data: session } = useSession();
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
            <div className="flex relative flex-wrap bg-neutral-800 items-center bg-neutral text-neutral-content w-11/12 h-16 mx-auto rounded-b-xl justify-between">
                <div className="flex-1 inline-flex justify-start">
                    <Menu>
                        <Menu.Button className="flex flex-row items-center justify-center px-4 py-2 text-sm font-medium text-neutral-content rounded-lg hover:bg-neutral-focus focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 stroke-neutral-100"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute mt-10 z-10 capitalize bg-neutral-700 p-4 rounded-2xl w-40 divide-y text-neutral-100">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <button type="button" onClick={() => setTheme(!theme)}>
                                            Change theme
                                        </button>
                                    </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <NextLink href="/users">Users</NextLink>
                                    </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <NextLink href="/tickets">Tickets</NextLink>
                                    </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <NextLink href="/store">Store</NextLink>
                                    </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <NextLink href="/transactions">Transactions</NextLink>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
                <div className="flex-1 inline-flex items-center flex-shrink-0">
                    <div className="text-2xl cursor-default mx-auto uppercase text-neutral-100 font-black tracking-wide">
                        <Link href="/">
                            <span>{env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}</span>
                        </Link>
                    </div>
                </div>
                <div className="flex-1 inline-flex justify-end">
                    <Popover className="relative">
                        <Popover.Button>
                            {session?.user ? (
                                <div className="aspect-square w-12 relative mr-4">
                                    <Image
                                        alt={session?.user?.name as string}
                                        src={session?.user?.image as string}
                                        layout="fill"
                                        className="rounded-full"
                                        objectFit="contain"
                                    />
                                </div>
                            ) : (
                                <p>Test</p>
                            )}
                        </Popover.Button>
                        <Popover.Panel className="absolute z-10 bg-neutral-700 text-neutral-100 p-6 rounded-xl">
                            <p>{session?.user?.name || "Giriş yapmalısın"}</p>
                            {session?.user && <p>Points: {session.user.points}</p>}
                        </Popover.Panel>
                    </Popover>
                </div>
            </div>
        </>
    );
}
