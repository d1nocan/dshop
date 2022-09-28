import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { env } from "src/env/client.mjs";

const Home: NextPage = () => {
    const session = useSession();

    return (
        <section className="text-white">
            <div className="max-w-screen-xl px-4 mx-auto my-64 lg:h-96 lg:items-center lg:flex">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600">
                        {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                    </h1>
                    {session?.status === "unauthenticated" && (
                        <>
                            <p className="max-w-xl mx-auto mt-4 text-neutral-900 dark:text-neutral-100 sm:leading-relaxed sm:text-xl">
                                You need login to use app
                            </p>

                            <div className="flex flex-wrap justify-center gap-4 mt-8">
                                <button
                                    type="button"
                                    className="block w-2/3 px-12 py-3 text-sm font-medium text-white bg-violet-600 border border-violet-600 rounded sm:w-auto active:text-opacity-75 hover:bg-transparent hover:text-white focus:outline-none focus:ring duration-300"
                                    onClick={() => signIn()}
                                >
                                    Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Home;
