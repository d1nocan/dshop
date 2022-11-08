import Image from "next/image";
import { type TicketStatus, Ticket, type User } from "@prisma/client";
import Link from "next/link";
import { buttonStyle } from "@styles/button";

type Props = {
    ticket: Ticket & { user: User };
};

const StatusColor = (status: TicketStatus | undefined) => {
    switch (status) {
        case "Open":
            return "bg-green-600 animate-ping";
        case "Closed":
            return "bg-red-600";
        default:
            return "bg-gray-800";
    }
};

const Ticket = ({ ticket }: Props) => {
    return (
        <div className="relative my-3 flex h-60 w-full flex-col justify-center rounded bg-neutral-200 dark:bg-neutral-800 md:w-80">
            <div className={`absolute left-4 top-4 h-4 w-4 rounded-full ${StatusColor(ticket.status)}`}></div>
            <div className="mt-10 space-y-2 pl-6">
                <Image
                    src={ticket.user.image as string}
                    alt={ticket.user.name as string}
                    className="rounded-xl"
                    width={40}
                    height={40}
                />
                <h1 className="font-bold">{ticket.user.name}</h1>
                <p className="text-sm opacity-50">{ticket.createdAt?.toLocaleString()}</p>
                <h2 className="text-left font-medium">{ticket.title}</h2>
            </div>
            <div className="flex justify-end px-4">
                <Link href={`./tickets/${ticket.id}`}>
                    <button type="button" className={buttonStyle({ theme: "primary", outline: true })}>
                        Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Ticket;
