import { useSession } from "next-auth/react";
import { Item, Role, Transaction, User } from "@prisma/client";
import { useState } from "react";
import { TransactionModal } from "@components/modal";

type Props = {
  index: number;
  transaction: Transaction & { user: User, item: Item };
};

const Transaction = ({ index, transaction }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const session = useSession();
  return (
    <>
        <th>{index}</th>
        <td>{transaction.user.name}</td>
        <td>{transaction.id}</td>
        <td className="max-w-md overflow-auto">{transaction.input}</td>
        <td>{transaction.points.toString()}</td>
        <td>{transaction.status}</td>
        {session.data?.user?.role === Role.Admin && (
          <td>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowModal(true)}>
              EDIT
            </button>
            {showModal && (<TransactionModal setShowModal={setShowModal} transaction={transaction}/>)}
          </td>
        )}
    </>
  );
};

export default Transaction;
