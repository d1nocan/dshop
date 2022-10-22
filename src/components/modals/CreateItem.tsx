import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createItem } from "@schemas/item";
import { Fragment, useState } from "react";
import ModalLoading from "./ModalLoading";
import toast from "react-hot-toast";
import { Plus } from "phosphor-react";

export const CreateItem = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const utils = trpc.useContext();
    const { mutate } = trpc.item.create.useMutation({
        onSuccess: () => {
            utils.item.get.invalidate();
            setLoading(false);
            toast("Item Created!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900",
            });
            closeModal();
        },
        onError: () => {
            setLoading(false);
        },
    });
    const {
        register,
        watch,
        getValues,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createItem),
        defaultValues: {
            name: "",
            description: "",
            input: "",
            image: "",
            price: BigInt(0),
            quantity: 0,
            cooldown: 0,
            inputRequired: false,
            isHidden: true,
        },
    });
    async function onSubmit() {
        setLoading(true);
        const filelist = (document.getElementById("filecrt") as HTMLInputElement).files as FileList;
        if (filelist.length > 0) {
            const uploadImage = await import("@utils/supabase").then((mod) => mod.default);
            const link = (await uploadImage(filelist)) as string;
            setValue("image", link);
        }
        setValue("cooldown", getValues("cooldown") * 1000);
        mutate(getValues());
    }
    return (
        <>
            <button type="button" onClick={openModal} className="button primary mx-auto mt-10 flex font-bold">
                Create Item
                <Plus size={22} className="ml-2" />
            </button>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
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
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            Create Item
                                        </Dialog.Title>
                                        <div className="modal-body">
                                            <div className="input-area lg:col-span-2">
                                                <label className="label">
                                                    <span className="label-text">Item Name</span>
                                                </label>
                                                <input
                                                    title="Item Name"
                                                    type="text"
                                                    className="input"
                                                    {...register("name")}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="input-area lg:col-span-2">
                                                <label className="label">
                                                    <span className="label-text">Item Description</span>
                                                </label>
                                                <textarea
                                                    title="Item Description"
                                                    className="textarea w-fit"
                                                    {...register("description")}
                                                ></textarea>
                                                {errors.description && (
                                                    <p className="mt-1 text-center font-light text-red-500">
                                                        {errors.description.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="input-area w-full max-w-xs">
                                                <label className="label">
                                                    <span className="label-text">Price</span>
                                                </label>
                                                <input
                                                    title="Price"
                                                    type="number"
                                                    className="input input-bordered w-full max-w-xs"
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
                                            <div className="input-area w-full max-w-xs">
                                                <label className="label">
                                                    <span className="label-text">Quantity</span>
                                                </label>
                                                <input
                                                    title="Quantity"
                                                    type="number"
                                                    className="input input-bordered w-full max-w-xs"
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
                                            <div className="input-area my-2 w-full max-w-xs">
                                                <label className="label">
                                                    <span className="label-text">Global Cooldown</span>
                                                </label>
                                                <input
                                                    title="Global cooldown (seconds)"
                                                    type="number"
                                                    className="input input-bordered w-full max-w-xs"
                                                    {...register("cooldown", { valueAsNumber: true })}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Seconds</span>
                                                </label>
                                            </div>
                                            <div className="input-area flex w-full max-w-xs flex-row justify-center">
                                                <label className="label">
                                                    <span className="label-text">Image</span>
                                                </label>
                                                <input
                                                    title="Image"
                                                    type="file"
                                                    accept="image/*"
                                                    id="filecrt"
                                                    className="file:bg-primary hover:file:bg-primary-focus w-fit max-w-xs px-2 text-sm file:mx-8 file:mr-4 file:rounded-full file:border-0 file:py-1 file:px-2 file:text-sm file:font-semibold file:text-neutral-900 file:duration-300 lg:mb-8 lg:mt-2 file:lg:mx-2"
                                                />
                                            </div>
                                            <div className="input-area ml-2 flex w-full max-w-xs flex-row items-center justify-between">
                                                <span className="label-text">Is input required?</span>
                                                <input
                                                    title="Is input required?"
                                                    type="checkbox"
                                                    className="toggle"
                                                    {...register("inputRequired")}
                                                />
                                            </div>
                                            <div className="input-area ml-2 flex w-full max-w-xs flex-row items-center justify-between">
                                                <span className="label-text">Is hidden item?</span>
                                                <input
                                                    title="Is hidden item?"
                                                    type="checkbox"
                                                    className="toggle"
                                                    {...register("isHidden")}
                                                />
                                            </div>
                                            {watch("inputRequired") && (
                                                <div className="input-area mx-auto w-full max-w-xs">
                                                    <label className="label">
                                                        <span className="label-text">Type wanted input</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your input"
                                                        className="input input-bordered text-primary-content w-full max-w-xs"
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
                                        <div className="flew-row mt-6 flex justify-end gap-4">
                                            <button type="submit" className="button success outline">
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                className="button danger outline"
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

export default CreateItem;
