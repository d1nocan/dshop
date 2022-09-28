import UpdateTransaction from "@modals/UpdateTransaction";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "src/utils/trpc";

const Transactions: NextPage = () => {
    const session = useSession();
    const { data: transactions, refetch, error } = trpc.useQuery(["transaction.get"]);
    const router = useRouter();
    error?.data?.code === "UNAUTHORIZED" && router.push("/");
    return (
        <>
            {session.data?.user &&
                <>
                    {transactions?.length as number > 0 ? (
                    <div className="container mx-auto mt-10 overflow-x-auto shadow-xl">
                        <table className="min-w-max w-full table-auto">
                            <thead>
                                <tr className="dark:bg-neutral-900 dark:text-neutral-100 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left"></th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-left">Input</th>
                                    <th className="py-3 px-6 text-left">Points</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    {session.data?.user?.role === Role.Admin && (
                                        <th className="py-3 px-6 text-center">Edit</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="text-neutral-50 text-sm font-light">
                                {transactions?.map((transaction, index) => (
                                    <tr
                                        key={index}
                                        className="border-b duration-300 text-neutral-900 dark:text-neutral-100 border-neutral-200 bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-neutral-300"
                                    >
                                        <UpdateTransaction index={index} transaction={transaction} refetch={refetch} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            ) : (
                <div className="alert alert-info w-fit mx-auto justify-center mt-10 shadow-lg">
                    <div>
                        <span>No Transaction found</span>
                    </div>
                </div>
            )}
            </>
            }
        </>
    );
};

export default Transactions;
