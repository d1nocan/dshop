import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Transaction from "src/components/dashboard/transaction";
import { trpc } from "src/utils/trpc";

const Transactions: NextPage = () => {
  const session = useSession();
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
        {session.data?.user?.role === Role.Admin && <th>Edit</th>}
      </tr>
    </thead>
    <tbody>
      {transactions.data?.map((transaction, index) => (
        <tr key={index}>
        <Transaction
          key={index}
          index={index}
          transaction={transaction}
        />
        </tr>
      ))}
      </tbody>
      </table>
      </div>
    </>
  );
};

export default Transactions;
