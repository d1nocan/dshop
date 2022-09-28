import Image from "next/image";
import { Ticket, User } from "@prisma/client";
import Link from "next/link";

type Props = {
    index: number;
    ticket: Ticket & { user: User };
};

const Ticket = ({ index, ticket }: Props) => {
    return (
        <tr className="border-b duration-300 text-neutral-900 dark:text-neutral-100 border-neutral-200 bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-neutral-300">
            <td className="py-3 px-6 text-left">{index}</td>
            <td className="py-3 px-6 text-left">
                <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 ">
                        <div className="mask mask-squircle w-12 h-12">
                            <Image
                                src={ticket.user.image as string}
                                alt={ticket.user.name as string}
                                layout="fill"
                                objectFit="inherit"
                                className="rounded-xl"
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
                    <button type="button" className="btn-prm-outline">
                        Details
                    </button>
                </Link>
            </td>
        </tr>
    );
};

export default Ticket;