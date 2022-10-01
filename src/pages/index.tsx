import type { NextPage } from "next";
import { env } from "src/env/client.mjs";

const Home: NextPage = () => {
    return (
        <section className="text-white">
            <div className="my-64 mx-auto max-w-screen-xl px-4 lg:flex lg:h-96 lg:items-center">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="select-none bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                        {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default Home;
