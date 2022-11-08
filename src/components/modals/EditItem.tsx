import { zodResolver } from "@hookform/resolvers/zod";
import { type Item } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { updateItem } from "@schemas/item";
import { Fragment, useState } from "react";
import uploadImage from "@utils/supabase";
import ModalLoading from "./ModalLoading";
import toast from "react-hot-toast";
import { PencilSimple } from "phosphor-react";
import { inputStyle, textAreaStyle, checkboxStyle, inputAreaStyle } from "@styles/input";
import { buttonStyle } from "@styles/button";
interface Items {
    item: Item;
}

export const EditItem = ({ item }: Items) => {
    const utils = trpc.useContext();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { mutate } = trpc.item.update.useMutation({
        onSuccess: () => {
            utils.item.get.invalidate();
            setLoading(false);
            toast("Item updated!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900",
            });
            closeModal();
        },
    });
    const { mutate: deleteMutate } = trpc.item.delete.useMutation({
        onSuccess: () => {
            utils.item.get.invalidate();
            setLoading(false);
            closeModal();
        },
    });
    const {
        register,
        watch,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateItem),
        defaultValues: {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            input: item.input,
            inputRequired: item.inputRequired,
            cooldown: item.cooldown,
            isHidden: item.isHidden,
        },
    });
    async function onSubmit() {
        setLoading(true);
        const filelist = (document.getElementById(`fileupl-${item?.id}`) as HTMLInputElement).files as FileList;
        if (filelist.length > 0) {
            const link = (await uploadImage(filelist)) as string;
            setValue("image", link);
        }
        mutate(getValues());
    }
    return (
        <>
            <button
                title="Edit item"
                onClick={openModal}
                type="button"
                className="absolute right-2 top-2 mx-auto flex gap-2 p-1"
            >
                <PencilSimple size={18} className="my-auto" />
            </button>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40"
                    onClose={() => {
                        closeModal();
                        reset();
                    }}
                >
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
                                    <form>
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            Edit : {item.name}
                                        </Dialog.Title>
                                        <div className="modal-body">
                                            <div className={inputAreaStyle() + " lg:col-span-2"}>
                                                <label className="label">
                                                    <span className="label-text">Item Name</span>
                                                </label>
                                                <input
                                                    title="Item Name"
                                                    type="text"
                                                    className={inputStyle({ size: "xl" })}
                                                    {...register("name")}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={inputAreaStyle() + " lg:col-span-2"}>
                                                <label className="label">
                                                    <span className="label-text">Item Description</span>
                                                </label>
                                                <textarea
                                                    title="Item Description"
                                                    className={textAreaStyle()}
                                                    {...register("description")}
                                                ></textarea>
                                                {errors.description && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.description.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <label className="label">
                                                    <span className="label-text">Price</span>
                                                </label>
                                                <input
                                                    title="Price"
                                                    type="number"
                                                    className={inputStyle()}
                                                    {...register("price", {
                                                        setValueAs: (value) => BigInt(value),
                                                    })}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Points</span>
                                                </label>
                                                {errors.price && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.price.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <label className="label">
                                                    <span className="label-text">Quantity</span>
                                                </label>
                                                <input
                                                    title="Quantity"
                                                    type="number"
                                                    className={inputStyle()}
                                                    {...register("quantity", { valueAsNumber: true })}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Pcs</span>
                                                </label>
                                                {errors.quantity && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.quantity.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <label className="label">
                                                    <span className="label-text">Global Cooldown</span>
                                                </label>
                                                <input
                                                    title="Global cooldown (seconds)"
                                                    type="number"
                                                    className={inputStyle()}
                                                    {...register("cooldown", { valueAsNumber: true })}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Seconds</span>
                                                </label>
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <label className="label">
                                                    <span className="label-text">Image</span>
                                                </label>
                                                <input
                                                    title="Image"
                                                    type="file"
                                                    accept="image/*"
                                                    id={`fileupl-${item?.id}`}
                                                    className="file:bg-primary hover:file:bg-primary-focus -ml-4 w-fit max-w-xs px-2 text-sm file:mx-8 file:mr-4 file:rounded-full file:border-0 file:py-1 file:px-2 file:text-sm file:font-semibold file:text-neutral-900 file:duration-300 lg:ml-3 lg:mb-8 lg:mt-2 file:lg:mx-2"
                                                />
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <span className="label-text">Is input required?</span>
                                                <input
                                                    title="Is input required?"
                                                    type="checkbox"
                                                    className={checkboxStyle() + " mx-auto"}
                                                    {...register("inputRequired")}
                                                />
                                            </div>
                                            <div className={inputAreaStyle()}>
                                                <span className="label-text">Is hidden item?</span>
                                                <input
                                                    title="Is hidden item?"
                                                    type="checkbox"
                                                    className={checkboxStyle() + " mx-auto"}
                                                    {...register("isHidden")}
                                                />
                                            </div>
                                            {watch("inputRequired") && (
                                                <div className={inputAreaStyle() + " lg:col-span-2"}>
                                                    <label className="label">
                                                        <span className="label-text">Type wanted input</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your input"
                                                        className={inputStyle({ size: "xl" })}
                                                        {...register("input")}
                                                    />
                                                    {errors.input && (
                                                        <p className="mt-1 text-center font-light text-red-500">
                                                            {errors.input.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mx-auto mt-6 flex w-fit flex-col justify-end gap-4 sm:w-full sm:flex-row">
                                            <button
                                                type="button"
                                                className={buttonStyle({ theme: "success", outline: true })}
                                                onClick={onSubmit}
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className={buttonStyle({ theme: "warning", outline: true })}
                                                onClick={() => {
                                                    deleteMutate({ id: item.id });
                                                }}
                                            >
                                                Delete
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

export default EditItem;
