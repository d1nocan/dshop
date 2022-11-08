import type { TicketStatus } from "@prisma/client";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { buttonStyle } from "@styles/button";

const Ticket: NextPage = () => {
    const session = useSession();
    const router = useRouter();
    const isAdmin = session.data?.user?.role === "Admin";
    const userId = session.data?.user?.id;
    const Image = dynamic(() => import("next/image"));
    const TicketForm = dynamic(() => import("@forms/ticket"));
    const { data, refetch } = trpc.ticket.select.useQuery({ id: router.query.id as string });
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
    useEffect(() => {
        if (
            session.status === "unauthenticated" ||
            (session.data?.user?.role !== "Admin" && data?.userId !== session.data?.user?.id)
        ) {
            console.log(data?.userId !== session.data?.user?.id);
            router.push("/");
        }
    }, [data?.userId, router, session.data?.user?.id, session.data?.user?.role, session.status]);
    return (
        <>
            <div className="container m-10 mx-auto flex w-[95vw] flex-col rounded-lg bg-neutral-200 p-4 duration-300 dark:bg-neutral-700 sm:w-[80vw] lg:w-[60vw]">
                <h1 className="mb-4 text-center text-4xl font-bold text-neutral-900 duration-300 dark:text-neutral-100">
                    {data?.title}
                </h1>
                <h2 className={`text-center ${statusColor(data?.status)} mb-4 text-2xl`}>{data?.status}</h2>
                {isAdmin && (
                    <div className="flex flex-row justify-center">
                        <button
                            type="button"
                            className={buttonStyle({ theme: data?.status === "Open" ? "danger" : "success" })}
                            onClick={() =>
                                updateTicket({
                                    id: data?.id as string,
                                    status: data?.status === "Open" ? "Closed" : "Open",
                                })
                            }
                        >
                            {data?.status === "Open" ? "Close" : "Open"}
                        </button>
                    </div>
                )}
                <ul className="mx-auto mb-10 w-4/6 sm:w-5/6">
                    {data?.messages?.map((message) => (
                        <li key={message.id} className="my-4">
                            <div
                                className={`relative flex w-full flex-col p-3 sm:w-fit sm:py-3 sm:pr-20 sm:pl-4 ${
                                    userId === message.userId ? "ml-auto" : "mr-auto"
                                } rounded-lg bg-neutral-300 text-neutral-900 duration-300 dark:bg-neutral-800 dark:text-neutral-100`}
                            >
                                <div className="mb-4">
                                    <div className="relative h-12 w-12">
                                        <Image
                                            src={(message.user.image as string) || "/dalle.png"}
                                            alt={message.user.name as string}
                                            className="rounded-xl"
                                            width={44}
                                            height={44}
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
                {data?.status === "Open" && <TicketForm data={data} userId={userId} refetch={refetch} />}
            </div>
        </>
    );
};

export default Ticket;
