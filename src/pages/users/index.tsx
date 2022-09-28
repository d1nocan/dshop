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
            <div className="container flex flex-wrap justify-center gap-4 mx-auto px-6 py-10">
                {data?.map((user, index) => (
                    <UserModal key={index} user={user} session={session} />
                ))}
                {data?.length === 0 && (
                    <div className="alert alert-info w-fit mx-auto justify-center mt-10 shadow-lg">
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
