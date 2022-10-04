import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { trpc } from "@utils/trpc";
import { Role } from "@prisma/client";
import Loading from "@general/loading";
import Alert from "@general/alert";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import dynamic from "next/dynamic";

const UserCard = dynamic(() => import("@cards/UserCard"));


interface Props {
    isAdmin: boolean;
}

const Users: NextPage<Props> = ({ isAdmin }) => {
    const { data, isLoading } = trpc.useQuery(["user.get"]);
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data?.map((user, index) => (
                    <UserCard key={index} user={user} isAdmin={isAdmin} />
                ))}
                {data?.length === 0 && !isLoading && <Alert type="info" message="No users found" />}
            </div>
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
