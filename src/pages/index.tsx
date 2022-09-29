import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { env } from "src/env/client.mjs";

const Home: NextPage = () => {
    const session = useSession();

    return (
        <section className="text-white">
            <div className="my-64 mx-auto max-w-screen-xl px-4 lg:flex lg:h-96 lg:items-center">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                        {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                    </h1>
                    {session?.status === "unauthenticated" && (
                        <>
                            <p className="mx-auto mt-4 max-w-xl text-neutral-900 dark:text-neutral-100 sm:text-xl sm:leading-relaxed">
                                You need login to use app
                            </p>

                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <button
                                    type="button"
                                    className="block w-2/3 rounded border border-violet-600 bg-violet-600 py-3 px-12 text-sm font-medium text-white duration-300 hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
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
