import { type Role } from "@prisma/client";
import { Content, Indicator, Item, List, Root, Trigger, Viewport } from "@radix-ui/react-navigation-menu";
import { links } from "@utils/links";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CaretDown } from "phosphor-react";

export const Links = () => {
    const { data: session } = useSession();
    return (
        <Root className="relative flex w-fit z-[1] mx-auto">
            <List className="flex p-2 rounded-md list-none">
                {links.map((part) =>
                    part.links.length > 1 ? (
                        <Item key={part.title}>
                            <Trigger className="flex duration-200 items-center group text-violet-500 focus:relative focus:shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 justify-between gap-1 py-2 px-3 outline-none select-none rounded text-base font-medium leading-none">
                                {part.title}
                                <CaretDown
                                    className="relative text-violet-500 top-0 transform group-data-[state=open]:-rotate-180 motion-safe:transition motion-safe:transform motion-safe:duration-200 motion-safe:ease-linear"
                                    aria-hidden
                                />
                            </Trigger>
                            <Content className="absolute w-fit rounded-md border border-neutral-200 dark:border-neutral-700 dark:border-opacity-40 motion-safe:data-[motion='from-start']:animate-enterFromLeft motion-safe:data-[motion='from-end']:animate-enterFromRight motion-safe:data-[motion='to-start']:animate-exitToLeft motion-safe:data-[motion='to-end']:animate-exitToRight">
                                <ul className="flex flex-col p-6 gap-x-3 list-none w-full">
                                    {part.links.map(
                                        (link) =>
                                            (link.roles.includes(session?.user?.role as Role) ||
                                                link.roles.length == 0) && (
                                                <li>
                                                    <Link
                                                        className="py-2 px-3 outline-none select-none font-medium text-[15px] text-violet-500 focus:relative focus:shadow-sm p-3 rounded-md hover:bg-violet-500 hover:bg-opacity-10 block no-underline text-base leading-none"
                                                        href={link.href}
                                                    >
                                                        <div
                                                            id="title"
                                                            className="font-medium leading-tight mb-2 text-violet-500"
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
                                className="flex duration-200 items-center group text-violet-500 focus:relative focus:shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 justify-between gap-1 py-2 px-3 outline-none select-none rounded text-base font-medium leading-none"
                                href={part.links[0]?.href as string}
                            >
                                {part.links[0]?.name}
                            </Link>
                        </Item>
                    ),
                )}
                <Indicator className="flex items-end justify-center h-[10px] top-full overflow-hidden z-10 transition-transform motion-safe:data-[state='visible']:animate-fadeIn motion-safe:data-[state='hidden']:animate-fadeOut">
                    <div className="relative top-[70%] bg-neutral-50 w-3 h-3 transform rotate-45 rounded-tl-sm" />
                </Indicator>
            </List>
            <div className="absolute flex justify-center w-full top-full -left-12">
                <Viewport className="relative mt-3 w-full bg-neutral-50 dark:bg-neutral-900 rounded-md overflow-hidden h-[var(--radix-navigation-menu-viewport-height)] sm:w-[var(--radix-navigation-menu-viewport-width)] motion-safe:transition-[width,_height] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:data-[state='open']:animate-scaleIn motion-safe:data-[state='closed']:animate-scaleOut" />
            </div>
        </Root>
    );
};

export default Links;
