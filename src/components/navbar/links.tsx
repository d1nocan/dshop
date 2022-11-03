import { type Role } from "@prisma/client";
import { Content, Indicator, Item, List, Root, Trigger, Viewport } from "@radix-ui/react-navigation-menu";
import { links } from "@utils/links";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CaretDown } from "phosphor-react";

export const Links = () => {
    const { data: session } = useSession();
    return (
        <Root className="relative z-[1] mx-auto flex w-fit">
            <List className="flex list-none rounded-md p-2">
                {links.map((part) =>
                    part.links.length > 1 ? (
                        <Item key={part.title}>
                            <Trigger className="group flex select-none items-center justify-between gap-1 rounded py-2 px-3 text-base font-medium leading-none text-violet-500 outline-none duration-200 hover:bg-neutral-200 focus:relative focus:shadow-sm dark:hover:bg-neutral-700">
                                {part.title}
                                <CaretDown
                                    className="relative top-0 transform text-violet-500 group-data-[state=open]:-rotate-180 motion-safe:transform motion-safe:transition motion-safe:duration-200 motion-safe:ease-linear"
                                    aria-hidden
                                />
                            </Trigger>
                            <Content className="absolute w-fit rounded-md border border-neutral-200 motion-safe:data-[motion='from-start']:animate-enterFromLeft motion-safe:data-[motion='from-end']:animate-enterFromRight motion-safe:data-[motion='to-start']:animate-exitToLeft motion-safe:data-[motion='to-end']:animate-exitToRight dark:border-neutral-700 dark:border-opacity-40">
                                <ul className="flex w-full list-none flex-col gap-x-3 p-6">
                                    {part.links.map(
                                        (link) =>
                                            (link.roles.includes(session?.user?.role as Role) ||
                                                link.roles.length == 0) && (
                                                <li key={link.name}>
                                                    <Link
                                                        className="block select-none rounded-md p-3 py-2 px-3 text-[15px] text-base font-medium leading-none text-violet-500 no-underline outline-none hover:bg-violet-500 hover:bg-opacity-10 focus:relative focus:shadow-sm"
                                                        href={link.href}
                                                    >
                                                        <div
                                                            id="title"
                                                            className="mb-2 font-medium leading-tight text-violet-500"
                                                        >
                                                            {link.name}
                                                        </div>
                                                        {/*<p id="text" className="text-violet-400 leading-normal">{description}</p>*/}
                                                    </Link>
                                                </li>
                                            ),
                                    )}
                                </ul>
                            </Content>
                        </Item>
                    ) : (
                        <Item key={part.title}>
                            <Link
                                className="group flex select-none items-center justify-between gap-1 rounded py-2 px-3 text-base font-medium leading-none text-violet-500 outline-none duration-200 hover:bg-neutral-200 focus:relative focus:shadow-sm dark:hover:bg-neutral-700"
                                href={part.links[0]?.href as string}
                            >
                                {part.links[0]?.name}
                            </Link>
                        </Item>
                    ),
                )}
                <Indicator className="top-full z-10 flex h-[10px] items-end justify-center overflow-hidden transition-transform motion-safe:data-[state='visible']:animate-fadeIn motion-safe:data-[state='hidden']:animate-fadeOut">
                    <div className="relative top-[70%] h-3 w-3 rotate-45 transform rounded-tl-sm bg-neutral-50" />
                </Indicator>
            </List>
            <div className="absolute top-full -left-12 flex w-full justify-center">
                <Viewport className="relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md bg-neutral-50 motion-safe:transition-[width,_height] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:data-[state='open']:animate-scaleIn motion-safe:data-[state='closed']:animate-scaleOut dark:bg-neutral-900 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
            </div>
        </Root>
    );
};

export default Links;
