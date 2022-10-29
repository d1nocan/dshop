import { env } from "./src/env/server.mjs";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["static-cdn.jtvnw.net", env.NEXT_PUBLIC_SUPABASE_URL.split("//")[1], "cloudflare-ipfs.com"],
    },
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
};
export default config;
