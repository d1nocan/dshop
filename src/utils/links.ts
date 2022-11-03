import type { Role } from "@prisma/client";

type link = {
    name: string;
    href: string;
    roles: Role[];
};

type Nav = {
    title: string;
    links: link[];
};

export const Store: Nav = {
    title: "Store",
    links: [
        {
            name: "Store",
            href: "/store",
            roles: [],
        },
        {
            name: "Transactions",
            href: "/transactions",
            roles: ["Admin", "User", "Banned"],
        },
        {
            name: "Giveaways",
            href: "/giveaways",
            roles: ["Admin", "User"],
        },
    ],
};

export const View: Nav = {
    title: "View",
    links: [
        {
            name: "Users",
            href: "/users",
            roles: [],
        },
        {
            name: "Tickets",
            href: "/tickets",
            roles: ["Admin", "User", "Banned"],
        },
        {
            name: "Predictions",
            href: "/predictions",
            roles: ["Admin", "User"],
        },
    ],
};

export const Admin: Nav = {
    title: "Admin",
    links: [
        {
            name: "Live Panel",
            href: "/live",
            roles: ["Admin"],
        },
    ],
};

// store 0, view 1, support 2, admin 3
export const links: Nav[] = [Store, View, Admin];
