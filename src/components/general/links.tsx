import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import NextLink from "./nextlink";

export const Links = () => {
    return (
        <>
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
        </>
    );
};

export default Links;
