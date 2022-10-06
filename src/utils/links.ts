import { Role } from "@prisma/client";

export const links = [
    {
        name: "Users",
        href: "/users",
    },
    {
        name: "Store",
        href: "/store",
    },
    {
        name: "Tickets",
        href: "/tickets",
        roles: [Role.Admin, Role.User, Role.Banned],
    },
    {
        name: "Transactions",
        href: "/transactions",
        roles: [Role.Admin, Role.User, Role.Banned],
    },
    {
        name: "Live Panel",
        href: "/live",
        roles: [Role.Admin],
    },
];