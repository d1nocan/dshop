import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import Loading from "@general/loading";
import FAQ from "@general/faq";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CreateTicket = dynamic(() => import("@modals/CreateTicket"));
const Ticket = dynamic(() => import("@tables/ticket"));
const Alert = dynamic(() => import("@general/alert"));

const Tickets: NextPage = () => {
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        session.status === "unauthenticated" && router.push("/");
    }, [router, session.status]);
    const { data: tickets, isLoading } = trpc.ticket.get.useQuery();
    if (isLoading) return <Loading />;
    return (
        <>
            {session.data?.user?.role === "User" && <CreateTicket />}
            <div className="container mx-auto mt-10 flex flex-row flex-wrap justify-center gap-4 px-6">
                {(tickets?.length as number) > 0 ? (
                    <>
                        {tickets?.map((ticket) => (
                            <Ticket key={ticket.id} ticket={ticket} />
                        ))}
                    </>
                ) : (
                    !isLoading && <Alert type="info" message="No tickets found" />
                )}
            </div>
            <FAQ />
        </>
    );
};

export default Tickets;
