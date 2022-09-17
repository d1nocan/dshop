import type { NextPage } from "next";
import Transaction from "src/components/dashboard/transaction";
import { trpc } from "src/utils/trpc";

const Transactions: NextPage = () => {
  const transactions = trpc.useQuery(["transaction.get"]);
  return (
    <>
    <div className="container mx-auto mt-10 overflow-x-auto">
    <table className="table table-zebra w-full">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>ID</th>
        <th>Input</th>
        <th>Points</th>
        <th>Status</th>
      </tr>
    </thead>
      {transactions.data?.map((transaction, index) => (
        <>
        <Transaction
          key={index}
          index={index}
          id={transaction.id}
          user={transaction.user.name}
          input={transaction.input}
          status={transaction.status}
          points={transaction.points}
        />
        </>
      ))}
      </table>
      </div>
    </>
  );
};

export default Transactions;
