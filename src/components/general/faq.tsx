import { CaretDown } from "phosphor-react";
import { cva } from "class-variance-authority";
import { Root, Item, Header, Trigger, Content } from "@radix-ui/react-accordion";
import { forwardRef, type ComponentProps } from "react";

const AccordionStyle = cva("rounded space-y-2 w-1/4 bg-transparent mx-auto mt-10");

const ItemStyle = cva(
    "overflow-hidden mt-0.5 first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-[1] focus-within:shadow",
);

const HeaderStyle = cva("[all:_'unset'] flex");

const TriggerStyle = cva(
    "[all:_'unset'] group bg-transparent rounded-md px-5 h-11 flex-1 flex gap-4 duration-300 items-center justify-between text-base border border-violet-500 leading-none text-violet-600 shadow data-[state='closed']:bg-neutral-50 data-[state='closed']:border-opacity-20 data-[state='open']:border-opacity-70 dark:data-[state='closed']:bg-neutral-900 data-[state='open']:bg-neutral-50 dark:data-[state='open']:bg-neutral-900 hover:bg-neutral-200",
);

const ContentStyle = cva(
    "overflow-hidden text-base text-neutral-900 dark:text-neutral-300 border-x last:border-b border-violet-500 border-opacity-20 bg-neutral-50 dark:bg-neutral-900 data-[state='open']:animate-slideDown data-[state='closed']:animate-slideUp",
);

const ContentTextStyle = cva("py-3.5 px-5");

const CaretStyle = cva(
    "text-violet-600 group-data-[state='open']:rotate-180 motion-safe:transform motion-safe:transition motion-safe:duration-200 motion-safe:ease-linear",
);

const AccordionTrigger = forwardRef<HTMLButtonElement, ComponentProps<typeof Trigger>>(
    ({ children, ...props }, forwardedRef) => (
        <Header className={HeaderStyle()}>
            <Trigger className={TriggerStyle()} {...props} ref={forwardedRef}>
                {children}
                <CaretDown className={CaretStyle()} aria-hidden />
            </Trigger>
        </Header>
    ),
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<HTMLDivElement, ComponentProps<typeof Content>>(
    ({ children, ...props }, forwardedRef) => (
        <Content className={ContentStyle()} {...props} ref={forwardedRef}>
            <div className={ContentTextStyle()}>{children}</div>
        </Content>
    ),
);
AccordionContent.displayName = "AccordionContent";

export default function FAQ() {
    return (
        <Root className={AccordionStyle()} type="single" defaultValue="item-1" collapsible>
            <Item className={ItemStyle()} value="item-1">
                <AccordionTrigger>I bought a product. When will it reach me?</AccordionTrigger>
                <AccordionContent>
                    We try to deliver the products quickly. It may take up to 5 business days for the product to reach
                    you.
                </AccordionContent>
            </Item>
            <Item className={ItemStyle()} value="item-2">
                <AccordionTrigger>How can I earn points?</AccordionTrigger>
                <AccordionContent>
                    You can earn points by watching live streams, redeeming codes or by joining any event.
                </AccordionContent>
            </Item>
        </Root>
    );
}
