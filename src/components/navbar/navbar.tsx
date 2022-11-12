import dynamic from "next/dynamic";

const Links = dynamic(() => import("./links"));

const UserPanel = dynamic(() => import("./userpanel"));

const Switch = dynamic(() => import("./switch"));

const Link = dynamic(() => import("next/link"));

export default function Navbar() {
    return (
        <>
            <div className="relative mx-auto flex w-full flex-row flex-wrap items-center justify-between rounded-b-xl bg-neutral-300 bg-opacity-20 px-4 dark:bg-neutral-800 dark:bg-opacity-20 lg:px-10">
                <div className="order-1 mt-2 inline-flex flex-1 select-none flex-row justify-start">
                    <div className="ml-4 cursor-default select-none text-2xl font-bold tracking-wide text-neutral-800 dark:text-neutral-100 md:mr-6">
                        <Link href="/" className="relative">
                            <h1 className="z-0 -ml-4 tracking-wide sm:ml-0">DShop</h1>
                            <h2 className="absolute top-0 -right-0.5 -z-10 text-violet-500" aria-hidden="true">
                                DShop
                            </h2>
                        </Link>
                    </div>
                    <Switch />
                </div>
                <div className="order-3 mb-4 inline-flex flex-1 flex-shrink-0 basis-11/12 justify-center md:order-2 md:mb-0 md:basis-0">
                    <Links />
                </div>
                <div className="order-2 mt-2 inline-flex h-max flex-1 select-none justify-end md:order-3">
                    <UserPanel />
                </div>
            </div>
        </>
    );
}
