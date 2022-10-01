import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";

interface Props {
    isAdmin?: boolean;
}

const UpdateTransaction = dynamic(() => import("@modals/UpdateTransaction"));

const Transactions: NextPage<Props> = ({ isAdmin }) => {
    const { data: transactions, refetch } = trpc.useQuery(["transaction.get"]);
    return (
        <>
            {(transactions?.length as number) > 0 ? (
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <table className="mx-auto w-10/12 min-w-max table-auto">
                        <thead>
                            <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
                                <th className="py-3 px-6 text-left"></th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Input</th>
                                <th className="py-3 px-6 text-left">Points</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                {isAdmin && <th className="py-3 px-6 text-center">Edit</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm font-light text-neutral-50">
                            {transactions?.map((transaction, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-neutral-200 bg-neutral-200 text-neutral-900 duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                                >
                                    <UpdateTransaction index={index} transaction={transaction} refetch={refetch} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="mx-auto mt-10 w-48 justify-center rounded-xl bg-violet-500 p-4 text-center text-neutral-100 shadow-lg">
                    <div>
                        <span>No Transaction found</span>
                    </div>
                </div>
            )}
        </>
    );
};

Transactions.getInitialProps = async (ctx) => {
    const { getSession } = await import("next-auth/react");
    const { Role } = await import("@prisma/client");
    const session = await getSession(ctx);
    const isAdmin = session?.user?.role === Role.Admin;
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        isAdmin,
    };
};

export default Transactions;
