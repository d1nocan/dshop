import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import UserModal from "@modals/UserModal";
import { useRouter } from "next/router";

const Users: NextPage = () => {
    const { data: session } = useSession();
    const { data, error } = trpc.useQuery(["user.get"]);
    const router = useRouter();
    error?.data?.code === "UNAUTHORIZED" && router.push("/");
    return (
        <>
            {session?.user && (
                <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                    {data?.map((user, index) => (
                        <UserModal key={index} user={user} session={session} />
                    ))}
                    {data?.length === 0 && (
                        <div className="alert alert-info mx-auto mt-10 w-fit justify-center shadow-lg">
                            <div>
                                <span>No user found</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Users;
