import { zodResolver } from "@hookform/resolvers/zod";
import { type Item } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { selectItem } from "@schemas/item";
import { Fragment, useState } from "react";
import ModalLoading from "./ModalLoading";
import toast from "react-hot-toast";
import { ShoppingBag } from "phosphor-react";
import { buttonStyle } from "@styles/button";
import { inputStyle } from "@styles/input";
interface Items {
    item: Item;
    isGuest: boolean;
}

export const BuyItem = ({ item, isGuest }: Items) => {
    const [loading, setLoading] = useState(false);
    const utils = trpc.useContext();
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { mutate } = trpc.item.buy.useMutation({
        onSuccess: () => {
            utils.item.get.invalidate();
            setLoading(false);
            toast("Item Bought!", {
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
        resolver: zodResolver(selectItem),
        defaultValues: {
            id: item.id,
            input: "",
        },
    });
    return (
        <>
            <button
                onClick={openModal}
                type="button"
                className={buttonStyle({ theme: "primary" }) + " mx-auto mt-2 gap-2"}
            >
                Get <ShoppingBag size={18} className="my-auto" />
            </button>
            <Transition appear show={showModal && !isGuest} as={Fragment}>
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
                                <Dialog.Panel className="modal">
                                    {loading && <ModalLoading />}
                                    <form className="p-6">
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            {item.name}
                                        </Dialog.Title>
                                        <Dialog.Description className="break-words py-4 text-center">
                                            {item.description}
                                            <br />
                                            <br />
                                            Price: {Number(item.price)}
                                            <br />
                                            Quantity: {item.quantity}
                                        </Dialog.Description>
                                        {item.inputRequired && (
                                            <div className="my-2 mx-auto flex w-full max-w-xs flex-col gap-2">
                                                <label className="text-center">
                                                    <span>{item.input}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={"Enter " + item.input}
                                                    className={inputStyle({ size: "xl" })}
                                                    {...register("input")}
                                                />
                                                {errors.input && <p className="text-red-500">{errors.input.message}</p>}
                                            </div>
                                        )}
                                        <div className="flew-row mt-6 flex justify-end gap-4">
                                            <button
                                                type="button"
                                                className={
                                                    buttonStyle({ theme: "success", outline: true }) +
                                                    ` ${item.quantity === 0 && "cursor-not-allowed"}`
                                                }
                                                disabled={item.quantity === 0}
                                                onClick={handleSubmit(() => {
                                                    setLoading(true);
                                                    mutate(getValues());
                                                })}
                                            >
                                                {item.quantity > 0 ? "Buy" : "Out of stock"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className={buttonStyle({ theme: "danger", outline: true })}
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

export default BuyItem;
