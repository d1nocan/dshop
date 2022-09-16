import type { NextPage } from "next";
import Transaction from "src/components/dashboard/transaction";
import { trpc } from "src/utils/trpc";

const Transactions: NextPage = () => {
  const transactions = trpc.useQuery(["transaction.get"]);
  return (
    <>
      {transactions.data?.map((transaction) => (
        <Transaction
          key={transaction.id}
          id={transaction.id}
          status={transaction.status}
          points={transaction.points}
        />
      ))}
    </>
  );
};

export default Transactions;
