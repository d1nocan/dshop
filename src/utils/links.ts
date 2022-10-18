import { Role } from "@prisma/client";
import { Users, Storefront, Ticket, Notepad, Question, Gift, GearSix } from "phosphor-react";

export const links = [
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
        roles: [Role.Admin, Role.User, Role.Banned],
        logo: Ticket,
    },
    {
        name: "Transactions",
        href: "/transactions",
        roles: [Role.Admin, Role.User, Role.Banned],
        logo: Notepad,
    },
    {
        name: "Predictions",
        href: "/predictions",
        roles: [Role.Admin, Role.User],
        logo: Question,
    },
    {
        name: "Giveaways",
        href: "/giveaways",
        roles: [Role.Admin, Role.User],
        logo: Gift,
    },
    {
        name: "Live Panel",
        href: "/live",
        roles: [Role.Admin],
        logo: GearSix,
    },
];
