import type { Item, Transaction as T, User } from "@prisma/client";

type Props = {
    transaction: T & { user: User; item: Item };
    onClick: () => void;
};

const Transaction = ({ transaction, onClick }: Props) => {
    return (
        <>
            <td className="py-3 px-6 text-left">{transaction.user.name}</td>
            <td className="py-3 px-6 text-left">{transaction.id}</td>
            <td className="max-w-md overflow-auto py-3 px-6 text-left">{transaction.input}</td>
            <td className="py-3 px-6 text-left">{transaction.points.toString()}</td>
            <td className="py-3 px-6 text-left">{transaction.status}</td>
            <td className="py-3 px-6 text-center">
                <button type="button" className="button secondary outline" onClick={onClick}>
                    VIEW
                </button>
            </td>
        </>
    );
};

export default Transaction;
