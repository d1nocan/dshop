import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Ticket from "@tables/ticket";
import { trpc } from "@utils/trpc";
import CreateTicket from "@modals/CreateTicket";

const Tickets: NextPage = () => {
    const { data: session } = useSession();
    const tickets = trpc.useQuery(["ticket.get"]);
    return (
        <>
            {session?.user?.role === Role.User && <CreateTicket />}
            <div className="container mx-auto mt-10 overflow-x-auto shadow-xl">
                {tickets.data?.length !== 0 ? (
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="dark:bg-neutral-900 dark:text-neutral-100 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left"></th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Title</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.data?.map((ticket, index) => (
                                <Ticket key={index} index={index} ticket={ticket} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info w-40 mx-auto justify-center mt-10 shadow-lg">
                        <div>
                            <span>No ticket found</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Tickets;
