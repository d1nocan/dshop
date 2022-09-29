import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { env } from "src/env/client.mjs";
import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Switch, Transition } from "@headlessui/react";
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
            <div className="bg-neutral text-neutral-content relative mx-auto flex h-16 w-11/12 flex-wrap items-center justify-between rounded-b-xl bg-neutral-800">
                <div className="inline-flex flex-1 justify-start">
                    {session && (
                        <Menu>
                            <Menu.Button
                                aria-label="Links"
                                className="text-neutral-content hover:bg-neutral-focus flex flex-row items-center justify-center rounded-lg py-2 px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                            >
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
                                <Menu.Items className="absolute z-10 mt-10 w-40 divide-y rounded-2xl bg-neutral-700 p-4 capitalize text-neutral-100">
                                    <div>
                                        <Menu.Item>
                                            <NextLink
                                                href="/users"
                                                className="group flex w-full items-center rounded-md py-2 px-2 text-sm"
                                            >
                                                Users
                                            </NextLink>
                                        </Menu.Item>
                                    </div>
                                    <div>
                                        <Menu.Item>
                                            <NextLink
                                                href="/tickets"
                                                className="group flex w-full items-center rounded-md py-2 px-2 text-sm"
                                            >
                                                Tickets
                                            </NextLink>
                                        </Menu.Item>
                                    </div>
                                    <div>
                                        <Menu.Item>
                                            <NextLink
                                                href="/store"
                                                className="group flex w-full items-center rounded-md py-2 px-2 text-sm"
                                            >
                                                Store
                                            </NextLink>
                                        </Menu.Item>
                                    </div>
                                    <div>
                                        <Menu.Item>
                                            <NextLink
                                                href="/transactions"
                                                className="group flex w-full items-center rounded-md py-2 px-2 text-sm"
                                            >
                                                Transactions
                                            </NextLink>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                    <Switch
                        checked={theme}
                        onChange={setTheme}
                        aria-label="Change Theme"
                        className={`${
                            theme ? "bg-neutral-100" : "bg-neutral-900"
                        } relative mt-2 inline-flex h-6 w-12 shrink-0 scale-75 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Change Theme</span>
                        <span
                            aria-hidden="true"
                            className={`${
                                !theme ? "translate-x-6 " : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-50 shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-neutral-900`}
                        />
                    </Switch>
                </div>
                <div className="inline-flex flex-1 flex-shrink-0 items-center">
                    <div className="mx-auto cursor-default text-2xl font-black uppercase tracking-wide text-neutral-100">
                        <Link href="/">
                            <span>{env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}</span>
                        </Link>
                    </div>
                </div>
                <div className="inline-flex flex-1 justify-end">
                    <Popover className="relative">
                        <Popover.Button>
                            {session?.user ? (
                                <div className="relative z-20 mr-4 aspect-square w-12">
                                    <Image
                                        alt={session?.user?.name as string}
                                        src={session?.user?.image as string}
                                        layout="fill"
                                        className="rounded-xl"
                                        objectFit="contain"
                                    />
                                </div>
                            ) : (
                                <p></p>
                            )}
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
                                <p className="mt-3 ml-6 font-bold">{session?.user?.name || "Giriş yapmalısın"}</p>
                                {session?.user && (
                                    <p className="text-center font-semibold">Points: {session.user.points}</p>
                                )}
                                <button
                                    type="button"
                                    className="btn-prm"
                                    onClick={() => (session?.user ? signOut() : signIn())}
                                >
                                    {session?.user ? "Sign Out" : "Sign in"}
                                </button>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>
            </div>
        </>
    );
}
