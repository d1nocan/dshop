import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import Loading from "@general/loading";
import FAQ from "@general/faq";
import { useRouter } from "next/router";

const CreateTicket = dynamic(() => import("@modals/CreateTicket"));
const Ticket = dynamic(() => import("@tables/ticket"));
const Alert = dynamic(() => import("@general/alert"));

const Tickets: NextPage = () => {
    const session = useSession();
    const router = useRouter();
    session.status === "unauthenticated" && router.push("/");
    const { data: tickets, isLoading } = trpc.ticket.get.useQuery();
    if (isLoading) return <Loading />;
    return (
        <>
            {session.data?.user?.role === "User" && <CreateTicket />}
            <div className="container mx-auto mt-10 overflow-x-auto">
                {(tickets?.length as number) > 0 ? (
                    <table className="mx-auto w-10/12 min-w-max table-auto">
                        <thead>
                            <tr className="text-sm uppercase leading-normal dark:bg-neutral-900 dark:text-neutral-100">
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left"></th>
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
                <FAQ />
            </div>
        </>
    );
};

export default Tickets;
