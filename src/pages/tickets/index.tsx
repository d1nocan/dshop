import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import Loading from "@general/loading";
import FAQ from "@general/faq";
import { useState } from "react";

const CreateTicket = dynamic(() => import("@modals/CreateTicket"));
const Ticket = dynamic(() => import("@tables/ticket"));
const Alert = dynamic(() => import("@general/alert"));

interface Props {
    isAdmin?: boolean;
}

const Tickets: NextPage = ({ isAdmin }: Props) => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { data: tickets, isLoading } = trpc.ticket.get.useQuery();
    if (isLoading) return <Loading />;
    return (
        <>
            {!isAdmin && (
                <button type="button" onClick={openModal} className="button primary mx-auto mt-10 flex font-bold">
                    Create Ticket
                </button>
            )}
            {showModal && <CreateTicket closeModal={closeModal} showModal={showModal} />}
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

Tickets.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const isAdmin = session?.user?.role === "Admin";
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
