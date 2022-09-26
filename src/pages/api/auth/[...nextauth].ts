import NextAuth, { type NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { Role } from "@prisma/client";
export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                const __user = await prisma.user.findUnique({
                    where: {
                        id: user.id,
                    },
                });
                session.user.id = user.id;
                session.user.cooldown = Number(__user?.cooldown) || 0;
                session.user.role = __user?.role || Role.User;
                session.user.points = Number(__user?.points) || 0;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        TwitchProvider({
            clientId: env.TWITCH_CLIENT_ID,
            clientSecret: env.TWITCH_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
};

export default NextAuth(authOptions);
