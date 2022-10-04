import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createItem } from "@schemas/item";
import { Fragment, useState } from "react";
import uploadImage from "@utils/supabase";

export const CreateItem = () => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const utils = trpc.useContext();
    const { mutate } = trpc.useMutation("item.create", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            closeModal();
        },
    });
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
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
    return (
        <>
            <button type="button" onClick={openModal} className="button primary mx-auto mt-10 flex font-bold text-neutral-100">
                Create Item
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
                                    <form
                                        onSubmit={handleSubmit(async () => {
                                            const filelist = (document.getElementById("filecrt") as HTMLInputElement)
                                                .files as FileList;
                                            if (filelist.length > 0) {
                                                const link = (await uploadImage(filelist)) as string;
                                                setValue("image", link);
                                            }
                                            setValue("cooldown", getValues("cooldown") * 1000);
                                            mutate(getValues());
                                        })}
                                    >
                                        <Dialog.Title className="truncate text-center text-3xl font-black">
                                            Create Item
                                        </Dialog.Title>
                                        <div className="modal-body">
                                            <div className="form-control lg:col-span-2">
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
                                            <div className="form-control lg:col-span-2">
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
                                            <div className="form-control w-full max-w-xs">
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
                                            <div className="form-control w-full max-w-xs">
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
                                            <div className="form-control my-2 w-full max-w-xs">
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
                                            <div className="form-control flex w-full max-w-xs flex-row justify-center">
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
                                            <div className="form-control ml-2 flex w-full max-w-xs flex-row items-center justify-between">
                                                <span className="label-text">Is input required?</span>
                                                <input
                                                    title="Is input required?"
                                                    type="checkbox"
                                                    className="toggle"
                                                    {...register("inputRequired")}
                                                />
                                            </div>
                                            <div className="form-control my-2 w-full max-w-xs">
                                                <label className="label">
                                                    <span className="label-text">Is hidden item?</span>
                                                    <input
                                                        title="Is hidden item?"
                                                        type="checkbox"
                                                        className="toggle"
                                                        {...register("isHidden")}
                                                    />
                                                </label>
                                            </div>
                                            {watch("inputRequired") && (
                                                <div className="form-control mx-auto w-full max-w-xs">
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
                                            <button type="submit" className="button button outline primary">
                                                Update
                                            </button>
                                            <button type="button" onClick={closeModal} className="button outline danger">
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
