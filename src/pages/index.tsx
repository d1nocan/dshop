import type { NextPage } from "next";
import { TwitchLogo } from "phosphor-react";
import Link from "next/link";
const Home: NextPage = () => {
    return (
        <section className="flex    h-[90vh] items-center justify-center">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="select-none bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                    Dshop
                </h1>
                <Link title="Twitch Channel" href="https://twitch.tv/d1nocan">
                    <TwitchLogo
                        size={44}
                        weight="light"
                        className="mx-auto my-4 text-neutral-900 duration-300 hover:cursor-pointer hover:text-violet-300 dark:text-neutral-50 dark:hover:cursor-pointer dark:hover:text-violet-300"
                    />
                </Link>
            </div>
        </section>
    );
};

export default Home;
