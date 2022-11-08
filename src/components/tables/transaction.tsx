import type { Item, Transaction as T, User, Status } from "@prisma/client";
import { buttonStyle } from "@styles/button";
import Image from "next/image";

type Props = {
    transaction: T & { user: User; item: Item };
    onClick: () => void;
};

const StatusColor = (status: Status | undefined) => {
    switch (status) {
        case "Completed":
            return "bg-green-600 ";
        case "Canceled":
            return "bg-red-600";
        case "Pending":
            return "bg-yellow-600 animate-ping";
        default:
            return "bg-gray-800";
    }
};

const Transaction = ({ transaction, onClick }: Props) => {
    return (
        <div className="relative my-3 flex h-64 w-full flex-col justify-center rounded bg-neutral-200 dark:bg-neutral-800 md:w-80">
            <div className={`absolute right-4 top-2 h-4 w-4 rounded-full ${StatusColor(transaction.status)}`}></div>
            <div className="mt-10 space-y-2 pl-6">
                <Image
                    src={transaction.user.image as string}
                    alt={transaction.user.name as string}
                    className="rounded-xl"
                    width={52}
                    height={52}
                />
                <h1 className="font-bold">{transaction.user.name}</h1>
                <p className="text-sm opacity-50">{transaction.createdAt?.toLocaleString()}</p>
                <h2 className="text-left text-sm font-medium">{transaction.input}</h2>
                <p className="text-sm">ID: {transaction.id}</p>
                <p className="text-left">Points: {transaction.points.toString()}</p>
            </div>

            <div className="mb-4 flex justify-end px-2">
                <button type="button" className={buttonStyle({ theme: "secondary", outline: true })} onClick={onClick}>
                    View
                </button>
            </div>
        </div>
    );
};

export default Transaction;
