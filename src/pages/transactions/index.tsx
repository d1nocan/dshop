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
            {session.data?.user && (
                <>
                    {(transactions?.length as number) > 0 ? (
                        <div className="container mx-auto mt-10 overflow-x-auto shadow-xl">
                            <table className="w-full min-w-max table-auto">
                                <thead>
                                    <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
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
                                <tbody className="text-sm font-light text-neutral-50">
                                    {transactions?.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-neutral-200 bg-neutral-200 text-neutral-900 duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                                        >
                                            <UpdateTransaction
                                                index={index}
                                                transaction={transaction}
                                                refetch={refetch}
                                            />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info mx-auto mt-10 w-fit justify-center shadow-lg">
                            <div>
                                <span>No Transaction found</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Transactions;
