import { zodResolver } from "@hookform/resolvers/zod";
import { Role, TicketStatus } from "@prisma/client";
import { addMessage } from "@schemas/ticket";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Ticket = () => {
    const session = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { data, refetch, error } = trpc.useQuery(["ticket.select", { id: id as string }]);
    error?.data?.code === "UNAUTHORIZED" && router.push("/");
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
                return "text-green-500";
            case TicketStatus.Closed:
                return "text-red-500";
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
    console.log(getValues());
    return (
        <>
            {session.data?.user && (
            <div className="container mx-auto flex flex-col bg-neutral-700 rounded-lg w-6/12 m-10 p-4">
                <h1 className="text-center font-bold text-4xl mb-4 text-neutral-900 dark:text-neutral-100">
                    {data?.title}
                </h1>
                <h2 className={`text-center font-light ${statusColor(data?.status)} text-2xl mb-4`}>{data?.status}</h2>
                {session.data?.user?.role === Role.Admin && (
                    <div className="flex flex-row justify-center">
                            <button
                                type="button"
                                className={`${data?.status === TicketStatus.Open ? "btn-can" : "btn-acc"} duration-300`}
                                onClick={() => updateTicket({ id: data?.id as string, status: data?.status === TicketStatus.Open ? TicketStatus.Closed : TicketStatus.Open })}
                            >
                                {data?.status === TicketStatus.Open ? ("Close") : ("Open")}
                            </button>
                    </div>
                )}
                <ul className="mx-auto w-4/6 mb-10">
                    {data?.messages?.map((message, index) => (
                        <li key={index} className="m-4">
                            <div
                                className={`flex flex-col relative w-fit ${
                                    session.data?.user?.id === message.userId ? "ml-auto" : "mr-auto"
                                } bg-neutral-800 rounded-lg p-4 text-neutral-100`}
                            >
                                <div className="mb-4">
                                    <div className="w-12 h-12 relative">
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
                                <p className="text-sm font-light mt-4">{message.createdAt.toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {data?.status === TicketStatus.Open && (
                    <div className="w-2/3 mx-auto bg-base-300 py-10 rounded-xl">
                        <form
                            onSubmit={handleSubmit(() => {
                                setValue("ticketId", data?.id as string);
                                mutate(getValues());
                            })}
                        >
                            <div className="form-control">
                                <label className="label">
                                    <span className="mx-auto text-neutral-100">Message</span>
                                </label>
                                <textarea
                                    className="textarea"
                                    placeholder="Message"
                                    {...register("content")}
                                ></textarea>
                            </div>
                            <div className="form-control mt-5">
                                <button type="submit" className="btn-prm">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            )}
        </>
    );
};

export default Ticket;
