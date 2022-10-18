import type { NextPage } from "next";
import { env } from "src/env/client.mjs";
import { TwitchLogo } from "phosphor-react";
import Link from "next/link";
const Home: NextPage = () => {
    return (
        <section>
            <div className="my-64 mx-auto max-w-screen-xl px-4 lg:flex lg:h-96 lg:items-center">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="select-none bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                        {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                    </h1>
                    <Link href={`https://twitch.tv/${env.NEXT_PUBLIC_TWITCH_CHANNEL}`}>
                        <TwitchLogo
                            size={44}
                            weight="light"
                            className="mx-auto my-4 text-neutral-900 duration-300 hover:cursor-pointer hover:text-violet-300 dark:text-neutral-50 dark:hover:cursor-pointer dark:hover:text-violet-300"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Home;
