import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createTicket } from "@schemas/ticket";
import { Fragment, useState } from "react";
import Button from "@general/button";
import ModalLoading from "./ModalLoading";

export const CreateTicket = () => {
    const [loading, setLoading] = useState(false);
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
            <Button type="primary" onClick={openModal} className="mx-auto mt-10 flex font-bold">
                Create Ticket
            </Button>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                <Dialog.Panel className="modal h-[60vh]">
                                    {loading && <ModalLoading />}
                                    <form>
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            Create Ticket
                                        </Dialog.Title>
                                        <div className="modal-body">
                                            <div className="input-area lg:col-span-2">
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
                                            <div className="input-area h-[25vh] lg:col-span-2">
                                                <label className="text-center">
                                                    <span>Message</span>
                                                </label>
                                                <textarea className="textarea h-full" {...register("message")} />
                                                {errors.message && (
                                                    <p className="text-red-500">{errors.message.message}</p>
                                                )}
                                            </div>
                                            {error && (
                                                <p className="mt-4 text-center text-lg font-light text-red-500">
                                                    {error.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-10 flex justify-end gap-4">
                                            <Button
                                                type="primary"
                                                outline
                                                onClick={handleSubmit(() => {
                                                    setLoading(true);
                                                    mutate(getValues());
                                                })}
                                            >
                                                Buy
                                            </Button>
                                            <Button type="danger" onClick={closeModal} outline>
                                                Cancel
                                            </Button>
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
