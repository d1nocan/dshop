import { trpc } from "@utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMessage } from "@schemas/ticket";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Ticket } from "@prisma/client";

interface Props {
    data: Ticket;
    userId?: string;
    refetch: () => void;
}

export const TicketForm = ({ data, userId, refetch }: Props) => {
    const { mutate } = trpc.ticket.addMessage.useMutation({
        onSuccess: () => {
            reset();
            refetch();
        },
    });
    const { register, handleSubmit, getValues, reset, setValue } = useForm({
        resolver: zodResolver(addMessage),
        defaultValues: {
            ticketId: data?.id as string,
            content: "",
            userId: userId as string,
        },
    });
    useEffect(() => {
        reset({ ticketId: data?.id as string, content: "", userId: userId as string });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, userId]);
    return (
        <div className="mx-auto mb-4 w-[50vw] max-w-[25rem] rounded-xl bg-neutral-300 px-4 py-10 duration-300 dark:bg-neutral-600">
            <form>
                <div className="input-area">
                    <label className="label">
                        <span className="mx-auto text-neutral-100">Message</span>
                    </label>
                    <textarea
                        className="textarea duration-300"
                        placeholder="Message"
                        {...register("content")}
                    ></textarea>
                </div>
                <div className="input-area mt-5">
                    <button
                        type="button"
                        className="button primary"
                        onClick={handleSubmit(() => {
                            setValue("ticketId", data?.id as string);
                            mutate(getValues());
                        })}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
