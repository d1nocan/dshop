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
                <div className="container mx-auto mt-10 flex flex-row flex-wrap justify-center gap-4 px-6">
                    {transactions?.map((transaction) => (
                        <UpdateTransaction key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            ) : (
                !isLoading && <Alert type="info" message="No transactions found" />
            )}
        </>
    );
};

export default Transactions;
