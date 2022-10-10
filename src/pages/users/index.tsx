import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { trpc } from "@utils/trpc";
import { Role } from "@prisma/client";
import Loading from "@general/loading";
import Alert from "@general/alert";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import dynamic from "next/dynamic";
import { KeyboardEvent, useState } from "react";

const UserCard = dynamic(() => import("@cards/UserCard"));

interface Props {
    isAdmin?: boolean;
}

const Users: NextPage<Props> = ({ isAdmin }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data, isLoading } = trpc.user.get.useQuery({ page: page, search: search });
    const { total, users } = data || {};
    const searchAction = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            setSearch((e.target as HTMLInputElement).value);
        }
    };
    const PageButton = () => (
        <div className="my-10 flex flex-row justify-center gap-8">
            <button
                type="button"
                className="rounded-md bg-neutral-200 px-4 py-2 text-neutral-900 duration-300 dark:bg-neutral-800 dark:text-neutral-100"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
            >
                {`<`}
            </button>
            <button
                type="button"
                className="rounded-md bg-neutral-200 px-4 py-2 text-neutral-900 duration-300 dark:bg-neutral-800 dark:text-neutral-100"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * 25 > (total as number)}
            >
                {`>`}
            </button>
        </div>
    );
    return (
        <>
            <PageButton />
            <div className="my-4 flex justify-center">
                <input
                    title="Search"
                    type="text"
                    placeholder="Search"
                    className="input text-neutral-50"
                    onKeyDown={searchAction}
                />
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="container mx-auto flex flex-wrap justify-center gap-4 px-6">
                    {users?.map((user) => (
                        <UserCard key={user.id} user={user} isAdmin={isAdmin as boolean} />
                    ))}
                    {users?.length === 0 && !isLoading && <Alert type="info" message="No users found" />}
                </div>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
    const isAdmin = session?.user?.role === Role.Admin;
    return {
        props: {
            session,
            isAdmin,
        },
    };
};

export default Users;
