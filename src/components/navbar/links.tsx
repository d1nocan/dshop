import { Menu, Transition } from "@headlessui/react";
import { type Role } from "@prisma/client";
import { links } from "@utils/links";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { List, Placeholder } from "phosphor-react";
import dynamic from "next/dynamic";

const NextLink = dynamic(() => import("@general/nextlink"));
export const Links = () => {
    const { data: session } = useSession();
    return (
        <>
            <Menu>
                <Menu.Button
                    aria-label="Links"
                    as="button"
                    className="text-neutral-content hover:bg-neutral-focus flex flex-row items-center justify-center rounded-lg py-2 px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    <List size={22} color="white" weight="bold" />
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
                    <Menu.Items
                        as="nav"
                        className="absolute z-10 mt-10 w-40 divide-y divide-neutral-800 divide-opacity-30 rounded-2xl bg-neutral-200 p-4 capitalize text-neutral-900 dark:divide-neutral-200 dark:divide-opacity-30 dark:bg-neutral-700 dark:text-neutral-100"
                    >
                        {links.map((link) => {
                            if (link.roles && !link.roles.includes(session?.user?.role as Role)) {
                                return null;
                            }
                            return (
                                <Menu.Item key={link.href} as="div" className="flex flex-row">
                                    {link.logo ? (
                                        <link.logo className="my-auto text-xl" />
                                    ) : (
                                        <Placeholder className="my-auto text-xl" />
                                    )}
                                    <NextLink
                                        href={link.href}
                                        className="group flex w-full items-center rounded-md py-2 px-2 text-sm capitalize"
                                    >
                                        {link.name}
                                    </NextLink>
                                </Menu.Item>
                            );
                        })}
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};

export default Links;
