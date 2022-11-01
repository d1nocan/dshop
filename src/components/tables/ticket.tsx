import Image from "next/image";
import { Ticket, type User } from "@prisma/client";
import Link from "next/link";

type Props = {
    ticket: Ticket & { user: User };
};

const Ticket = ({ ticket }: Props) => {
    return (
        <tr className="border-b border-neutral-200 bg-neutral-200 text-neutral-900 duration-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700">
            <td className="py-3 px-6 text-left">
                <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10">
                        <div className="mask mask-squircle h-12 w-12">
                            <Image
                                src={ticket.user.image as string}
                                alt={ticket.user.name as string}
                                className="rounded-xl"
                                width={40}
                                height={40}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{ticket.user.name}</div>
                        <div className="text-sm opacity-50">{ticket.createdAt?.toLocaleString()}</div>
                    </div>
                </div>
            </td>
            <td className="py-3 px-6 text-left">{ticket.title}</td>
            <td className="py-3 px-6 text-left">{ticket.status}</td>
            <td className="py-3 px-6 text-right">
                <Link href={`./tickets/${ticket.id}`}>
                    <button type="button" className="button primary outline">
                        Details
                    </button>
                </Link>
            </td>
        </tr>
    );
};

export default Ticket;
