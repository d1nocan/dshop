import Image from "next/image";
import { Ticket, User } from "@prisma/client";
import Link from "next/link";

type Props = {
    index: number;
    ticket: Ticket & { user: User };
};

const Ticket = ({ index, ticket }: Props) => {
    return (
        <>
            <tr>
                <td>{index}</td>
                <td>
                    <div className="flex items-center space-x-3">
                        <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                                <Image
                                    src={ticket.user.image as string}
                                    alt={ticket.user.name as string}
                                    layout="fill"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">{ticket.user.name}</div>
                            <div className="text-sm opacity-50">{ticket.createdAt?.toLocaleString()}</div>
                        </div>
                    </div>
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <th>
                    <Link href={`./tickets/${ticket.id}`}>
                        <button type="button" className="btn btn-ghost btn-xs">
                            details
                        </button>
                    </Link>
                </th>
            </tr>
        </>
    );
};

export default Ticket;
