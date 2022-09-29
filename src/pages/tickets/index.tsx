import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Ticket from "@tables/ticket";
import { trpc } from "@utils/trpc";
import CreateTicket from "@modals/CreateTicket";
import { useRouter } from "next/router";

const Tickets: NextPage = () => {
    const { data: session } = useSession();
    const tickets = trpc.useQuery(["ticket.get"]);
    const router = useRouter();
    tickets.error?.data?.code === "UNAUTHORIZED" && router.push("/");
    return (
        <>
            {session?.user?.role === Role.User && <CreateTicket />}
            {session?.user && (
                <div className="container mx-auto mt-10 overflow-x-auto shadow-xl">
                    {(tickets.data?.length as number) > 0 ? (
                        <table className="w-full min-w-max table-auto">
                            <thead>
                                <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
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
                        <div className="alert alert-info mx-auto mt-10 w-40 justify-center shadow-lg">
                            <div>
                                <span>No ticket found</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Tickets;
