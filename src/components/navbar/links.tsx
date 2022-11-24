import { type Role } from "@prisma/client";
import { Content, Indicator, Item, Link, List, Root, Trigger, Viewport } from "@radix-ui/react-navigation-menu";
import { links } from "@utils/links";
import { cva } from "class-variance-authority";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { CaretDown } from "phosphor-react";
import { forwardRef, type ComponentProps } from "react";

const MenuStyle = cva("relative z-20 justify-center flex flex-col w-fit");

const ListStyle = cva(
    "[all:_'unset'] flex justify-center bg-neutral-50 dark:bg-neutral-800 dark:bg-opacity-50 rounded-md list-none shadow-md",
);

const ItemStyle = cva(
    "py-2 px-3 outline-none select-none font-medium leading-none rounded text-base text-violet-500 focus:relative focus:ring-1 focus:ring-violet-500",
);

const TriggerStyle = cva("[all:_'unset'] " + ItemStyle() + " group flex items-center justify-between gap-1");

const CaretStyle = cva(
    "relative text-violet-500 transform group-data-[state=open]:-rotate-180 motion-safe:transform motion-safe:transition motion-safe:duration-200 motion-safe:ease-linear",
);

const LinkStyle = cva(ItemStyle() + " block no-underline text-base leading-none");

const ContentStyle = cva(
    "absolute top-0 left-0 w-full border rounded-md border-neutral-200 sm:w-auto motion-safe:data-[motion='from-start']:animate-enterFromLeft motion-safe:data-[motion='from-end']:animate-enterFromRight motion-safe:data-[motion='to-start']:animate-exitToLeft motion-safe:data-[motion='to-end']:animate-exitToRight dark:border-neutral-700 dark:border-opacity-60",
);

const IndicatorStyle = cva(
    "flex align-end justify-center h-2.5 top-full overflow-hidden z-10 motion-safe:transition-transform motion-safe:data-[state='visible']:animate-fadeIn motion-safe:data-[state='hidden']:animate-fadeOut",
);
const ArrowStyle = cva("relative top-[70%] h-3.5 w-3.5 rotate-45 transform rounded-tl-sm bg-violet-500");

const ViewportStyle = cva(
    "relative shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] dark:shadow-none origin-[top_left] mt-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md overflow-hidden h-[var(--radix-navigation-menu-viewport-height)] w-full sm:w-[var(--radix-navigation-menu-viewport-width)] motion-safe:transition-[width,_height] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:data-[state='open']:animate-scaleIn motion-safe:data-[state='closed']:animate-scaleOut",
);

const ContentListStyle = cva("grid p-[22px] m-0 col-gap-2.5 list-none w-max text-center grid-cols-1");

const LinkTitleStyle = cva("font-medium leading-tight text-violet-400 focus:border focus:border-violet-500");

const ViewportPositionStyle = cva("absolute flex justify-center w-4/6 sm:w-fit top-full [perspective:_'2000px']");

const StyledIndicatorWithArrow = forwardRef<HTMLDivElement>((props, forwardedRef) => (
    <Indicator className={IndicatorStyle()} {...props} ref={forwardedRef}>
        <div className={ArrowStyle()} />
    </Indicator>
));
StyledIndicatorWithArrow.displayName = "StyledIndicatorWithArrow";

const StyledTriggerWithCaret = forwardRef<HTMLButtonElement, ComponentProps<typeof Trigger>>(
    ({ children, ...props }, forwardedRef) => (
        <Trigger className={TriggerStyle()} {...props} ref={forwardedRef}>
            <div className={LinkTitleStyle()}>{children}</div>
            <CaretDown className={CaretStyle()} aria-hidden />
        </Trigger>
    ),
);
StyledTriggerWithCaret.displayName = "StyledTriggerWithCaret";

const ContentListItem = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(
    ({ href, title, ...props }, forwardedRef) => (
        <li>
            <NextLink href={href as string} passHref legacyBehavior>
                <Link className={LinkStyle()} {...props} ref={forwardedRef}>
                    <div className={LinkTitleStyle()}>{title}</div>
                </Link>
            </NextLink>
        </li>
    ),
);
ContentListItem.displayName = "ContentListItem";

export const Links = () => {
    const { data: session } = useSession();
    return (
        <Root aria-label="Navigation Menu" className={MenuStyle()}>
            <List className={ListStyle()}>
                {links.map((part) =>
                    part.links.length > 1 ? (
                        <Item key={part.title}>
                            <StyledTriggerWithCaret>{part.title}</StyledTriggerWithCaret>
                            <Content className={ContentStyle()}>
                                <ul className={ContentListStyle()}>
                                    {part.links.map(
                                        (link) =>
                                            (link.roles.includes(session?.user?.role as Role) ||
                                                link.roles.length == 0) && (
                                                <ContentListItem key={link.name} title={link.name} href={link.href} />
                                            ),
                                    )}
                                </ul>
                            </Content>
                        </Item>
                    ) : (
                        part.links[0]?.roles.includes(session?.user?.role as Role) && (
                            <ContentListItem key={part.title} title={part.title} href={part.links[0]?.href} />
                        )
                    ),
                )}
                <StyledIndicatorWithArrow />
            </List>
            <div className={ViewportPositionStyle()}>
                <Viewport className={ViewportStyle()} />
            </div>
        </Root>
    );
};

export default Links;
