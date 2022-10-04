import { zodResolver } from "@hookform/resolvers/zod";
import { TicketStatus } from "@prisma/client";
import { addMessage } from "@schemas/ticket";
import { trpc } from "@utils/trpc";
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { NextPage } from "next";

interface Props {
    id?: string | string[] | undefined;
    isAdmin?: boolean;
}

const Image = dynamic(() => import("next/image"));

const Ticket: NextPage<Props> = ({ id, isAdmin }) => {
    const session = useSession();
    const { data, refetch } = trpc.useQuery(["ticket.select", { id: id as string }]);
    const { mutate } = trpc.useMutation("ticket.addMessage", {
        onSuccess: () => {
            reset();
            refetch();
        },
    });
    const { mutate: updateTicket } = trpc.useMutation("ticket.update", {
        onSuccess: () => {
            reset();
            refetch();
        },
    });
    const statusColor = (status: TicketStatus | undefined) => {
        switch (status) {
            case TicketStatus.Open:
                return "text-green-600";
            case TicketStatus.Closed:
                return "text-red-600";
            default:
                return "text-gray-800";
        }
    };
    const { register, handleSubmit, getValues, reset, setValue } = useForm({
        resolver: zodResolver(addMessage),
        defaultValues: {
            ticketId: data?.id as string,
            content: "",
            userId: session.data?.user?.id as string,
        },
    });
    useEffect(() => {
        reset({ ticketId: data?.id as string, content: "", userId: session.data?.user?.id as string });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, session]);
    return (
        <>
            <div className="container m-10 mx-auto flex w-6/12 flex-col rounded-lg bg-neutral-700 p-4">
                <h1 className="mb-4 text-center text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    {data?.title}
                </h1>
                <h2 className={`text-center ${statusColor(data?.status)} mb-4 text-2xl`}>{data?.status}</h2>
                {isAdmin && (
                    <div className="flex flex-row justify-center">
                        <button
                            type="button"
                            className={`${data?.status === TicketStatus.Open ? "button danger" : "button success"} duration-300`}
                            onClick={() =>
                                updateTicket({
                                    id: data?.id as string,
                                    status:
                                        data?.status === TicketStatus.Open ? TicketStatus.Closed : TicketStatus.Open,
                                })
                            }
                        >
                            {data?.status === TicketStatus.Open ? "Close" : "Open"}
                        </button>
                    </div>
                )}
                <ul className="mx-auto mb-10 w-4/6">
                    {data?.messages?.map((message, index) => (
                        <li key={index} className="m-4">
                            <div
                                className={`relative flex w-fit flex-col ${
                                    session.data?.user?.id === message.userId ? "ml-auto" : "mr-auto"
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
                {data?.status === TicketStatus.Open && (
                    <div className="bg-base-300 mx-auto w-2/3 rounded-xl py-10">
                        <form
                            onSubmit={handleSubmit(() => {
                                setValue("ticketId", data?.id as string);
                                mutate(getValues());
                            })}
                        >
                            <div className="input-area">
                                <label className="label">
                                    <span className="mx-auto text-neutral-100">Message</span>
                                </label>
                                <textarea
                                    className="textarea"
                                    placeholder="Message"
                                    {...register("content")}
                                ></textarea>
                            </div>
                            <div className="input-area mt-5">
                                <button type="submit" className="button primary">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

Ticket.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const { Role } = await import("@prisma/client");
    const id = ctx.query?.id;
    const isAdmin = session?.user?.role === Role.Admin;
    console.log(session?.user?.role);
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
    };
};

export default Ticket;
