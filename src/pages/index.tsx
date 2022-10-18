import type { NextPage } from "next";
import { env } from "src/env/client.mjs";
import { getBaseUrl } from "@utils/trpc";
const Home: NextPage = () => {
    return (
        <section>
            <div className="my-64 mx-auto max-w-screen-xl px-4 lg:flex lg:h-96 lg:items-center">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="select-none bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                        {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                    </h1>
                </div>
                <div className="mx-auto mt-4 w-max lg:mt-0">
                    <iframe
                        title="Twitch stream"
                        src={`https://player.twitch.tv/?channel=${env.NEXT_PUBLIC_TWITCH_CHANNEL}&parent=${
                            getBaseUrl().split("//")[1]?.split(":")[0]
                        }&muted=true`}
                        allowFullScreen={true}
                        className="aspect-video w-full rounded-lg border-2 border-violet-500 border-opacity-30 lg:w-[40vw]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Home;
