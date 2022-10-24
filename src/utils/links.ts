import type { Role } from "@prisma/client";
import { Users, Storefront, Ticket, Notepad, Question, Gift, GearSix } from "phosphor-react";
import type { IconProps } from "phosphor-react";

type links = {
    name: string;
    href: string;
    roles?: Role[];
    logo: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
}[];

export const links: links = [
    {
        name: "Users",
        href: "/users",
        logo: Users,
    },
    {
        name: "Store",
        href: "/store",
        logo: Storefront,
    },
    {
        name: "Tickets",
        href: "/tickets",
        roles: ["Admin", "User", "Banned"],
        logo: Ticket,
    },
    {
        name: "Transactions",
        href: "/transactions",
        roles: ["Admin", "User", "Banned"],
        logo: Notepad,
    },
    {
        name: "Predictions",
        href: "/predictions",
        roles: ["Admin", "User"],
        logo: Question,
    },
    {
        name: "Giveaways",
        href: "/giveaways",
        roles: ["Admin", "User"],
        logo: Gift,
    },
    {
        name: "Live Panel",
        href: "/live",
        roles: ["Admin"],
        logo: GearSix,
    },
];
