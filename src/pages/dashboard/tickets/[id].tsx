import { zodResolver } from "@hookform/resolvers/zod";
import { TicketStatus } from "@prisma/client";
import { addMessage } from "@schemas/ticket";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const Ticket = () => {
    const session = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { data, refetch } = trpc.useQuery(["ticket.select", { id: id as string }]);
    const { mutate } = trpc.useMutation("ticket.addMessage", {
        onSuccess: () => {
            reset();
            refetch();
        },
    });
    const statusColor = (status: TicketStatus | undefined) => {
        switch (status) {
            case TicketStatus.Open:
                return "text-success";
            case TicketStatus.Closed:
                return "text-error";
            default:
                return "text-gray-800";
        }
    };
    const { register, handleSubmit, getValues, reset } = useForm({
        resolver: zodResolver(addMessage),
        defaultValues: {
            ticketId: data?.id as string,
            content: "",
            userId: session.data?.user?.id as string,
        },
    });
    return (
        <>
            <div className="container mx-auto flex flex-col bg-base-200 rounded-lg w-7/12 m-10 p-4">
                <h1 className="text-center font-bold text-4xl mb-4">{data?.title}</h1>
                <h2 className={`text-center font-light ${statusColor(data?.status)} text-2xl mb-4`}>{data?.status}</h2>
                <ul className="mx-auto w-4/6 mb-10">
                    {data?.messages?.map((message) => (
                        <li key={message.id} className="m-4">
                            <div
                                className={`flex flex-col relative w-3/6 ${
                                    session.data?.user?.id === message.userId ? "ml-auto" : "mr-auto"
                                } bg-base-300 rounded-lg p-4`}
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
                                <p className="text-sm font-light">{message.createdAt.toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {data?.status === TicketStatus.Open && (
                    <div className="w-2/3 mx-auto bg-base-300 py-10 rounded-xl">
                        <form onSubmit={handleSubmit(() => mutate(getValues()))}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="mx-auto text-base-content">Message</span>
                                </label>
                                <textarea
                                    className="textarea h-24 w-2/3 mx-auto bg-base-200 textarea-bordered"
                                    placeholder="Message"
                                    {...register("content")}
                                ></textarea>
                            </div>
                            <div className="form-control mt-5">
                                <button type="submit" className="btn btn-primary w-1/3 mx-auto">
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

export default Ticket;
