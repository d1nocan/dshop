import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createTicket } from "@schemas/ticket";
import { Fragment, useState } from "react";
import ModalLoading from "./ModalLoading";
import toast from "react-hot-toast";
import { Plus } from "phosphor-react";
import { buttonStyle } from "@styles/button";
import { inputAreaStyle, inputStyle, textAreaStyle } from "@styles/input";

export const CreateTicket = () => {
    const [loading, setLoading] = useState(false);
    const utils = trpc.useContext();
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { mutate } = trpc.ticket.create.useMutation({
        onSuccess: () => {
            utils.ticket.get.invalidate();
            setLoading(false);
            toast("Ticket Created!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900",
            });
            closeModal();
        },
        onError: (err) => {
            setLoading(false);
            toast(err.message, {
                icon: "❌",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900",
            });
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
            <button
                type="button"
                onClick={openModal}
                className={buttonStyle({ theme: "primary" }) + " mx-auto mt-10 font-bold"}
            >
                Create Ticket
                <Plus size={22} className="ml-2" />
            </button>
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
                                <Dialog.Panel className="modal h-fill">
                                    {loading && <ModalLoading />}
                                    <form>
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            Create Ticket
                                        </Dialog.Title>
                                        <div className="modal-body py-4">
                                            <div className={inputAreaStyle() + " lg:col-span-2"}>
                                                <label className="text-center">
                                                    <span>Title</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={"Enter title"}
                                                    className={inputStyle({ size: "xl" })}
                                                    {...register("title")}
                                                />
                                                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                                            </div>
                                            <div className={inputAreaStyle() + " lg:col-span-2"}>
                                                <label className="text-center">
                                                    <span>Message</span>
                                                </label>
                                                <textarea
                                                    className={textAreaStyle() + " mt-2 -ml-6 h-40 w-72"}
                                                    {...register("message")}
                                                />
                                                {errors.message && (
                                                    <p className="text-red-500">{errors.message.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-10 mb-0 flex justify-end gap-4">
                                            <button
                                                type="button"
                                                className={buttonStyle({ theme: "success", outline: true })}
                                                onClick={handleSubmit(() => {
                                                    setLoading(true);
                                                    mutate(getValues());
                                                })}
                                            >
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                className={buttonStyle({ theme: "danger", outline: true })}
                                                onClick={closeModal}
                                            >
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
