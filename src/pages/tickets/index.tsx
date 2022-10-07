import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import Alert from "@general/alert";
import Loading from "@general/loading";

const CreateTicket = dynamic(() => import("@modals/CreateTicket"));
const Ticket = dynamic(() => import("@tables/ticket"));

interface Props {
    isAdmin?: boolean;
}

const Tickets: NextPage<Props> = ({ isAdmin }) => {
    const { data: tickets, isLoading } = trpc.ticket.get.useQuery();
    if (isLoading) return <Loading />;
    return (
        <>
            {isAdmin && <CreateTicket />}
            <div className="container mx-auto mt-10 overflow-x-auto">
                {(tickets?.length as number) > 0 ? (
                    <table className="mx-auto w-10/12 min-w-max table-auto">
                        <thead>
                            <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Title</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets?.map((ticket) => (
                                <Ticket key={ticket.id} ticket={ticket} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !isLoading && <Alert type="info" message="No tickets found" />
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
