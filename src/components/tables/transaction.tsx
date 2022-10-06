import { useSession } from "next-auth/react";
import { Item, Role, Status, Transaction, User } from "@prisma/client";
import Button from "@general/button";

type Props = {
    index: number;
    transaction: Transaction & { user: User; item: Item };
    onClick: () => void;
};

const Transaction = ({ index, transaction, onClick }: Props) => {
    const session = useSession();
    return (
        <>
            <td className="py-3 px-6 text-left">{index}</td>
            <td className="py-3 px-6 text-left">{transaction.user.name}</td>
            <td className="py-3 px-6 text-left">{transaction.id}</td>
            <td className="max-w-md overflow-auto py-3 px-6 text-left">{transaction.input}</td>
            <td className="py-3 px-6 text-left">{transaction.points.toString()}</td>
            <td className="py-3 px-6 text-left">{transaction.status}</td>
            {session.data?.user?.role === Role.Admin && (
                <td className="py-3 px-6 text-center">
                    <Button type="secondary" outline onClick={onClick}>
                        {transaction.status === Status.Pending ? "EDIT" : "VIEW"}
                    </Button>
                </td>
            )}
        </>
    );
};

export default Transaction;
