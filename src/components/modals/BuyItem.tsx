import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { selectItem } from "@schemas/item";
import { Fragment, useState } from "react";
import Button from "@general/button";
import ModalLoading from "./ModalLoading";

interface Items {
    item: Item;
    closeModal: () => void;
    showModal: boolean;
    isGuest: boolean;
}

export const BuyItem = ({ item, isGuest, closeModal, showModal }: Items) => {
    const [loading, setLoading] = useState(false);
    const utils = trpc.useContext();
    const { mutate, error } = trpc.useMutation("item.buy", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            closeModal();
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
    console.log(errors);
    return (
        <>
            <Transition appear show={showModal && !isGuest} as={Fragment}>
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
                                    {loading && (!errors || !error) && <ModalLoading />}
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
                                                    className="input"
                                                    {...register("input")}
                                                />
                                                {errors.input && <p className="text-red-500">{errors.input.message}</p>}
                                            </div>
                                        )}
                                        {error && (
                                            <p className="mt-4 text-center text-lg font-light text-red-500">
                                                {error.message}
                                            </p>
                                        )}
                                        <div className="flew-row mt-6 flex justify-end gap-4">
                                            <Button
                                                type="success"
                                                outline
                                                className={`${item.quantity === 0 && "cursor-not-allowed"}`}
                                                disabled={item.quantity === 0}
                                                onClick={handleSubmit(() => {
                                                    setLoading(true);
                                                    mutate(getValues());
                                                })}
                                            >
                                                {item.quantity > 0 ? "Buy" : "Out of stock"}
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

export default BuyItem;
