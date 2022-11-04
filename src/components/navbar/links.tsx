import { type Role } from "@prisma/client";
import { w } from "windstitch";
import {
    Content,
    Indicator,
    Item,
    List,
    Root,
    Trigger,
    Viewport,
    Link,
    type NavigationMenuLinkProps,
} from "@radix-ui/react-navigation-menu";
import { links } from "@utils/links";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { CaretDown } from "phosphor-react";
import { type ComponentProps, forwardRef } from "react";
const StyledMenu = w(Root, {
    className: "relative z-20 z-1 justify-center flex flex-col w-fit",
});
const StyledList = w(List, {
    className:
        "[all:_'unset'] flex justify-center bg-neutral-50 dark:bg-neutral-900 p-1 rounded-md list-none shadow-md",
});

const itemStyles = {
    className:
        "py-2 px-3 outline-none select-none font-medium leading-none rounded text-base text-violet-500 focus:relative focus:ring-1 focus:ring-violet-500",
};

const StyledTrigger = w(Trigger, {
    className: "[all:_'unset'] " + itemStyles.className + " group flex items-center justify-between gap-1",
});

const StyledCaret = w(CaretDown, {
    className:
        "relative text-violet-500 top-[1px] transform group-data-[state=open]:-rotate-180 motion-safe:transform motion-safe:transition motion-safe:duration-200 motion-safe:ease-linear",
});

const StyledLink = w(Link, {
    className: itemStyles.className + " block no-underline text-base leading-none",
});

const StyledContent = w(Content, {
    className:
        "absolute top-0 left-0 w-full border rounded-md border-neutral-200 sm:w-auto motion-safe:data-[motion='from-start']:animate-enterFromLeft motion-safe:data-[motion='from-end']:animate-enterFromRight motion-safe:data-[motion='to-start']:animate-exitToLeft motion-safe:data-[motion='to-end']:animate-exitToRight dark:border-neutral-700 dark:border-opacity-60",
});

const StyledIndicator = w(Indicator, {
    className:
        "flex align-end justify-center h-2.5 top-full overflow-hidden z-10 motion-safe:transition-transform motion-safe:data-[state='visible']:animate-fadeIn motion-safe:data-[state='hidden']:animate-fadeOut",
});

const StyledArrow = w.div("relative top-[70%] h-3.5 w-3.5 rotate-45 transform rounded-tl-sm bg-violet-500");

const StyledIndicatorWithArrow = forwardRef<HTMLDivElement>((props, forwardedRef) => (
    <StyledIndicator {...props} ref={forwardedRef}>
        <StyledArrow />
    </StyledIndicator>
));
StyledIndicatorWithArrow.displayName = "StyledIndicatorWithArrow";

const StyledViewport = w(Viewport, {
    className:
        "relative shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] dark:shadow-none origin-[top_left] mt-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md overflow-hidden h-[var(--radix-navigation-menu-viewport-height)] w-full sm:w-[var(--radix-navigation-menu-viewport-width)] motion-safe:transition-[width,_height] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:data-[state='open']:animate-scaleIn motion-safe:data-[state='closed']:animate-scaleOut",
});

const ContentList = w.ul("grid p-[22px] m-0 col-gap-2.5 list-none", {
    variants: {
        layout: {
            one: "w-max text-center grid-cols-1",
            two: "sm:w-[600px] sm:grid-flow-col sm:grid-cols-3",
        },
    },
    defaultVariants: {
        layout: "one",
    },
});

const ListItem = w.li("");
const LinkTitle = w.div("font-medium leading-tight text-violet-500 focus:border focus:border-violet-500");

const StyledTriggerWithCaret = forwardRef<HTMLButtonElement, ComponentProps<typeof StyledTrigger>>(
    ({ children, ...props }, forwardedRef) => (
        <StyledTrigger {...props} ref={forwardedRef}>
            <LinkTitle>{children}</LinkTitle>
            <StyledCaret aria-hidden />
        </StyledTrigger>
    ),
);
StyledTriggerWithCaret.displayName = "StyledTriggerWithCaret";

const ContentListItem = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
    ({ href, title, ...props }, forwardedRef) => (
        <NextLink href={href as string} passHref legacyBehavior>
            <StyledLink {...props} ref={forwardedRef}>
                <LinkTitle>{title}</LinkTitle>
            </StyledLink>
        </NextLink>
    ),
);
ContentListItem.displayName = "ContentListItem";

const ViewportPosition = w.div(
    "absolute flex justify-center w-4/6 sm:w-full top-full sm:-left-8 [perspective:_'2000px']",
);

export const Links = () => {
    const { data: session } = useSession();
    return (
        <StyledMenu>
            <StyledList>
                {links.map((part) =>
                    part.links.length > 1 ? (
                        <Item key={part.title}>
                            <StyledTriggerWithCaret>{part.title}</StyledTriggerWithCaret>
                            <StyledContent>
                                <ContentList>
                                    {part.links.map(
                                        (link) =>
                                            (link.roles.includes(session?.user?.role as Role) ||
                                                link.roles.length == 0) && (
                                                <ListItem>
                                                    <ContentListItem
                                                        key={link.name}
                                                        title={link.name}
                                                        href={link.href}
                                                    />
                                                </ListItem>
                                            ),
                                    )}
                                </ContentList>
                            </StyledContent>
                        </Item>
                    ) : (
                        <ContentListItem key={part.title} title={part.title} href={part.links[0]?.href} className="" />
                    ),
                )}
                <StyledIndicatorWithArrow />
            </StyledList>
            <ViewportPosition>
                <StyledViewport />
            </ViewportPosition>
        </StyledMenu>
    );
};

export default Links;
