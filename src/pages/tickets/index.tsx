import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";

const CreateTicket = dynamic(() => import("@modals/CreateTicket"));
const Ticket = dynamic(() => import("@tables/ticket"));

interface Props {
    isAdmin?: boolean;
}

const Tickets: NextPage<Props> = ({isAdmin}) => {
    const { data: tickets } = trpc.useQuery(["ticket.get"]);
    return (
        <>
            {isAdmin && <CreateTicket />}
                <div className="container mx-auto mt-10 overflow-x-auto">
                    {(tickets?.length as number) > 0 ? (
                        <table className="mx-auto w-10/12 min-w-max table-auto">
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
                                {tickets?.map((ticket, index) => (
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
        </>
    );
};

Tickets.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const { Role } = await import("@prisma/client");
    const isAdmin = session?.user?.role === Role.User;
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        isAdmin,
    };
};

export default Tickets;
