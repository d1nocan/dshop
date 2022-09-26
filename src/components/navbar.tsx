import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Moon from "../../public/moon.svg";
import Sun from "../../public/sun.svg";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { Role } from "@prisma/client";
import { env } from "src/env/client.mjs";
export default function Navbar() {
    const { data: session } = useSession();
    useEffect(() => {
        themeChange(false);
    }, []);
    return (
        <>
            <div className="navbar bg-neutral text-neutral-content w-11/12 mx-auto rounded-b-xl">
                <div className="flex-1 gap-3">
                    <div className="dropdown dropdown-hover">
                        <button type="button" title="Links" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-5 h-5 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </button>
                        <ul className="p-2 gap-3 shadow menu menu-compact dropdown-content bg-base-200 text-base-content rounded-box w-52">
                            <li>
                                <Link href="/dashboard/users">
                                    <a>Users</a>
                                </Link>
                            </li>
                            {session?.user?.role === Role.Admin && (
                                <li>
                                    <Link href="/dashboard/items">
                                        <a>Items</a>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href="/dashboard/tickets">
                                    <a>Tickets</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/store">
                                    <a>Store</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/transaction">
                                    <a>Transactions</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <label className="swap swap-rotate">
                        <input type="checkbox" title="theme" data-toggle-theme="dark,light" />

                        <Sun
                            className="swap-on fill-current w-10 h-10 pt-3"
                            data-set-theme="dark"
                            data-act-class="ACTIVECLASS"
                        />

                        <Moon
                            className="swap-off fill-current w-10 h-10 pt-3"
                            data-set-theme="light"
                            data-act-class="ACTIVECLASS"
                        />
                    </label>
                </div>
                <div className="flex-1 -ml-8">
                    <div className="btn btn-ghost text-xl">
                        <Link href="/">
                            <span>{env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}</span>
                        </Link>
                    </div>
                </div>
                {session?.user ? (
                    <div className="dropdown dropdown-hover dropdown-end pr-2">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-8">
                                <Image
                                    alt={session?.user?.name as string}
                                    src={session?.user?.image as string}
                                    layout="fill"
                                    className="rounded-full"
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="p-2 gap-3 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
                        >
                            <li>
                                <p className="mx-auto">{session.user.name}</p>
                            </li>
                            <li>
                                <span className="badge mx-auto">{session.user.points} Points</span>
                            </li>
                            <li>
                                <button type="button" className="mx-auto" onClick={() => signOut()}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button type="button" className="btn btn-primary" onClick={() => signIn()}>
                        Login
                    </button>
                )}
            </div>
        </>
    );
}
