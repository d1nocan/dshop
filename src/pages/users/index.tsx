import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import { Role } from "@prisma/client";

const UserModal = dynamic(() => import("@modals/UserModal"));

const Users: NextPage = () => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === Role.Admin;
    const { data } = trpc.useQuery(["user.get"]);
    return (
        <>
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data?.map((user, index) => (
                    <UserModal key={index} user={user} isAdmin={isAdmin} />
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

export default Users;
