// src/pages/_app.tsx
import Head from "next/head";
import Layout from "@general/layout";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import "@styles/globals.css";
import { trpc } from "@utils/trpc";

const Dshop: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>DShop</title>
                <meta name="description" content="Generated by Dinocan" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
};

export default trpc.withTRPC(Dshop);
