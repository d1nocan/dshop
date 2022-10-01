import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import { Role } from "@prisma/client";
import UserCard from "@cards/UserCard";
import Loading from "@general/loading";

interface Props {
    isAdmin: boolean;
}

const Users: NextPage<Props> = ({isAdmin}) => {
    const { data, isLoading } = trpc.useQuery(["user.get"]);
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data?.map((user, index) => (
                    <UserCard key={index} user={user} isAdmin={isAdmin} />
                ))}
                {data?.length === 0 && (
                    <div className="alert alert-info mx-auto mt-10 w-fit justify-center shadow-lg">
                        <div>
                            <span>No user found</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

Users.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const isAdmin = session?.user?.role === Role.Admin;
    return {
        isAdmin,
    };
};

export default Users;
