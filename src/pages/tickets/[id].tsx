import type { TicketStatus } from "@prisma/client";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

interface Props {
    id?: string | string[] | undefined;
    isAdmin?: boolean;
    userId?: string;
}

const Ticket: NextPage<Props> = ({ id, isAdmin, userId }) => {
    const Image = dynamic(() => import("next/image"));
    const TicketForm = dynamic(() => import("@forms/ticket"));
    const Button = dynamic(() => import("@general/button"));
    const { data, refetch } = trpc.ticket.select.useQuery({ id: id as string });
    const { mutate: updateTicket } = trpc.ticket.update.useMutation({
        onSuccess: () => {
            refetch();
        },
    });
    const statusColor = (status: TicketStatus | undefined) => {
        switch (status) {
            case "Open":
                return "text-green-600";
            case "Closed":
                return "text-red-600";
            default:
                return "text-gray-800";
        }
    };

    return (
        <>
            <div className="container m-10 mx-auto flex w-6/12 flex-col rounded-lg bg-neutral-700 p-4">
                <h1 className="mb-4 text-center text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    {data?.title}
                </h1>
                <h2 className={`text-center ${statusColor(data?.status)} mb-4 text-2xl`}>{data?.status}</h2>
                {isAdmin && (
                    <div className="flex flex-row justify-center">
                        <Button
                            type={`${data?.status === "Open" ? "danger" : "success"}`}
                            className="duration-300"
                            onClick={() =>
                                updateTicket({
                                    id: data?.id as string,
                                    status: data?.status === "Open" ? "Closed" : "Open",
                                })
                            }
                        >
                            {data?.status === "Open" ? "Close" : "Open"}
                        </Button>
                    </div>
                )}
                <ul className="mx-auto mb-10 w-4/6">
                    {data?.messages?.map((message) => (
                        <li key={message.id} className="m-4">
                            <div
                                className={`relative flex w-fit flex-col ${
                                    userId === message.userId ? "ml-auto" : "mr-auto"
                                } rounded-lg bg-neutral-800 p-4 text-neutral-100`}
                            >
                                <div className="mb-4">
                                    <div className="relative h-12 w-12">
                                        <Image
                                            src={(message.user.image as string) || "/dalle.png"}
                                            alt={message.user.name as string}
                                            layout="fill"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <span>{message.user.name}</span>
                                </div>
                                <div className="break-all">
                                    <span>{message.content}</span>
                                </div>
                                <p className="mt-4 text-sm font-light">{message.createdAt.toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {data?.status === "Open" && <TicketForm data={data} userId={userId} />}
            </div>
        </>
    );
};

Ticket.getInitialProps = async (ctx) => {
    const { getSession } = await import("next-auth/react");
    const session = await getSession(ctx);
    const id = ctx.query?.id;
    const isAdmin = session?.user?.role === "Admin";
    const userId = session?.user?.id;
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
        id,
        userId,
    };
};

export default Ticket;
