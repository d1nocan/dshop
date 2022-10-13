import Link from "next/link";
import type { LinkProps } from "next/link";
import { forwardRef, HTMLProps } from "react";

// eslint-disable-next-line react/display-name
const NextLink = forwardRef<HTMLAnchorElement, LinkProps & HTMLProps<HTMLAnchorElement>>(
    ({ href, children, ...rest }, ref) => {
        return (
            <Link href={href} prefetch={false}>
                <a ref={ref} {...rest}>
                    {children}
                </a>
            </Link>
        );
    },
);

export default NextLink;
