import { CaretDown } from "phosphor-react";
import { w } from "windstitch";
import {
    Root,
    Item,
    Header,
    Trigger,
    Content,
    type AccordionTriggerProps,
    type AccordionContentProps,
} from "@radix-ui/react-accordion";
import { forwardRef } from "react";

const StyledAccordion = w(Root, {
    className: "rounded space-y-2 w-1/4 bg-transparent mx-auto mt-10",
    defaultProps: {
        collapsible: true,
    },
});

const StyledItem = w(Item, {
    className:
        "overflow-hidden mt-0.5 first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-[1] focus-within:shadow",
});
const StyledHeader = w(Header, {
    className: "[all:_'unset'] flex",
});
const StyledTrigger = w(Trigger, {
    className:
        "[all:_'unset'] group bg-transparent rounded-md px-5 h-11 flex-1 flex gap-4 duration-300 items-center justify-between text-base border border-violet-500 leading-none text-violet-600 shadow data-[state='closed']:bg-neutral-50 data-[state='closed']:border-opacity-20 data-[state='open']:border-opacity-70 dark:data-[state='closed']:bg-neutral-900 data-[state='open']:bg-neutral-50 dark:data-[state='open']:bg-neutral-900 hover:bg-neutral-200",
});
const StyledContent = w(Content, {
    className:
        "overflow-hidden text-base text-neutral-900 dark:text-neutral-300 border-x last:border-b border-violet-500 border-opacity-20 bg-neutral-50 dark:bg-neutral-900 data-[state='open']:animate-slideDown data-[state='closed']:animate-slideUp",
});
const StyledContentText = w.div("py-3.5 px-5");
const StyledCaret = w(CaretDown, {
    className:
        "text-violet-600 group-data-[state='open']:rotate-180 motion-safe:transform motion-safe:transition motion-safe:duration-200 motion-safe:ease-linear",
});

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ children, ...props }, forwardedRef) => (
        <StyledHeader>
            <StyledTrigger {...props} ref={forwardedRef}>
                {children}
                <StyledCaret aria-hidden />
            </StyledTrigger>
        </StyledHeader>
    ),
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(({ children, ...props }, forwardedRef) => (
    <StyledContent {...props} ref={forwardedRef}>
        <StyledContentText>{children}</StyledContentText>
    </StyledContent>
));
AccordionContent.displayName = "AccordionContent";

export default function FAQ() {
    return (
        <StyledAccordion type="single" defaultValue="item-1">
            <StyledItem value="item-1">
                <AccordionTrigger>I bought a product. When will it reach me?</AccordionTrigger>
                <AccordionContent>
                    We try to deliver the products quickly. It may take up to 5 business days for the product to reach
                    you.
                </AccordionContent>
            </StyledItem>
            <StyledItem value="item-2">
                <AccordionTrigger>How can I earn points?</AccordionTrigger>
                <AccordionContent>
                    You can earn points by watching live streams, redeeming codes or by joining any event.
                </AccordionContent>
            </StyledItem>
        </StyledAccordion>
    );
}
