import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { selectItem } from "@schemas/item";
import { Fragment, useState } from "react";
import ItemCard from "@cards/ItemCard";

interface Items {
    item: Item;
}

export const BuyItem = ({ item }: Items) => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const utils = trpc.useContext();
    const { mutate, error } = trpc.useMutation("item.buy", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            setShowModal(false);
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
            <ItemCard item={item} onClick={openModal} />
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
                                            {item.name}
                                        </Dialog.Title>
                                        <Dialog.Description className="py-4 break-words text-center">
                                            {item.description}
                                            <br />
                                            <br />
                                            Price: {Number(item.price)}
                                            <br />
                                            Quantity: {item.quantity}
                                        </Dialog.Description>
                                        {item.inputRequired && (
                                            <div className="flex flex-col w-full max-w-xs mx-auto my-2 gap-2">
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

export default BuyItem;