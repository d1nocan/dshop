import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createTicket } from "@schemas/ticket";
import { Fragment, useState } from "react";

export const CreateTicket = () => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const utils = trpc.useContext();
    const { mutate, error } = trpc.useMutation("ticket.create", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["ticket.get"]);
            setShowModal(false);
        },
    });
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createTicket),
        defaultValues: {
            title: "",
            message: "",
        },
    });
    return (
        <>
            <button type="button" onClick={openModal} className="btn-prm flex mx-auto text-neutral-100 font-bold mt-10">
                Create Ticket
            </button>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="modal">
                                    <form
                                        onSubmit={handleSubmit(() => {
                                            mutate(getValues());
                                        })}
                                    >
                                        <Dialog.Title className="text-center font-black text-3xl truncate">
                                            Create Ticket
                                        </Dialog.Title>
                                        <div className="flex flex-col w-full max-w-xs mx-auto my-2 gap-2">
                                            <label className="text-center">
                                                <span>Title</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={"Enter title"}
                                                className="input"
                                                {...register("title")}
                                            />
                                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                                        </div>
                                        <div className="flex flex-col w-full max-w-xs mx-auto my-2 h-60 gap-2">
                                            <label className="text-center">
                                                <span>Message</span>
                                            </label>
                                            <textarea className="textarea" {...register("message")} />
                                            {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                                        </div>
                                        {error && (
                                            <p className="text-red-500 text-center mt-4 text-lg font-light">
                                                {error.message}
                                            </p>
                                        )}
                                        <div className="flex flew-row justify-end gap-4 mt-6">
                                            <button type="submit" className="btn-prm-outline">
                                                Buy
                                            </button>
                                            <button type="button" onClick={closeModal} className="btn-can-outline">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default CreateTicket;
