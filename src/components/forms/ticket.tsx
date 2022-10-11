import Button from "@general/button";
import { trpc } from "@utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMessage } from "@schemas/ticket";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Ticket } from "@prisma/client";

interface Props {
    data: Ticket;
    userId?: string;
}

export const TicketForm = ({ data, userId }: Props) => {
    const { mutate } = trpc.ticket.addMessage.useMutation({
        onSuccess: () => {
            reset();
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
        <div className="bg-base-300 mx-auto w-2/3 rounded-xl py-10">
            <form>
                <div className="input-area">
                    <label className="label">
                        <span className="mx-auto text-neutral-100">Message</span>
                    </label>
                    <textarea className="textarea" placeholder="Message" {...register("content")}></textarea>
                </div>
                <div className="input-area mt-5">
                    <Button
                        type="primary"
                        onClick={handleSubmit(() => {
                            setValue("ticketId", data?.id as string);
                            mutate(getValues());
                        })}
                    >
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
