import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import Loading from "@general/loading";
import Alert from "@general/alert";
import dynamic from "next/dynamic";
import { KeyboardEvent, useState } from "react";
import { MagnifyingGlass, ArrowLeft, ArrowRight } from "phosphor-react";
import { useSession } from "next-auth/react";

const UserCard = dynamic(() => import("@cards/UserCard"));

const Users: NextPage = () => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "Admin";
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data, isLoading } = trpc.user.get.useQuery({ page: page, search: search });
    const { total, users } = data || {};
    const searchAction = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            setSearch((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
        }
    };
    const PageButton = () => (
        <div className="mt-10 mb-6 flex flex-row justify-center gap-8">
            <button
                type="button"
                title="Previous Page"
                className="rounded-md bg-neutral-200 p-4 text-neutral-900 duration-300 dark:bg-neutral-800 dark:text-neutral-100"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
            >
                <ArrowLeft weight="bold" />
            </button>
            <button
                type="button"
                title="Next Page"
                className="rounded-md bg-neutral-200 p-4 text-neutral-900 duration-300 dark:bg-neutral-800 dark:text-neutral-100"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * 25 > (total as number)}
            >
                <ArrowRight weight="bold" />
            </button>
        </div>
    );
    return (
        <>
            <div className="relative my-10 mx-auto flex w-min">
                <input
                    title="Search"
                    type="text"
                    placeholder="Search"
                    className="input text-neutral-900 dark:text-neutral-50"
                    onKeyDown={searchAction}
                />
                <MagnifyingGlass
                    size={22}
                    weight="bold"
                    className="absolute left-auto right-2 top-2 text-neutral-500 opacity-50"
                />
            </div>
            <PageButton />
            <div className="container mx-auto flex flex-wrap justify-center gap-4 px-6">
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {users?.map((user) => (
                            <UserCard key={user.id} user={user} isAdmin={isAdmin as boolean} />
                        ))}
                        {users?.length === 0 && !isLoading && <Alert type="info" message="No users found" />}
                    </>
                )}
            </div>
        </>
    );
};

export default Users;
