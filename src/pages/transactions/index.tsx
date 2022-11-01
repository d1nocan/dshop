import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import Alert from "@general/alert";
import Loading from "@general/loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const UpdateTransaction = dynamic(() => import("@modals/UpdateTransaction"));

const Transactions: NextPage = () => {
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        session.status === "unauthenticated" && router.push("/");
    }, [router, session.status]);
    const { data: transactions, isLoading } = trpc.transaction.get.useQuery();
    if (isLoading) return <Loading />;
    return (
        <>
            {(transactions?.length as number) > 0 ? (
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <table className="mx-auto w-10/12 min-w-max table-auto">
                        <thead>
                            <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Input</th>
                                <th className="py-3 px-6 text-left">Points</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                {session.data?.user?.role === "Admin" && <th className="py-3 px-6 text-center"></th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm font-light text-neutral-50">
                            {transactions?.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-neutral-200 bg-neutral-200 text-neutral-900 duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                                >
                                    <UpdateTransaction transaction={transaction} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !isLoading && <Alert type="info" message="No transactions found" />
            )}
        </>
    );
};

export default Transactions;
