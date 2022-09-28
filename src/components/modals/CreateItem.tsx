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
            <button type="button" onClick={openModal} className="btn-prm flex mx-auto text-neutral-100 font-bold mt-10">
                Create Item
            </button>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
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
                                        <Dialog.Title className="text-center font-black text-3xl truncate">
                                            Create Item
                                        </Dialog.Title>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center items-center place-items-center">
                                            <div className="form-control col-span-2">
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
                                                    <p className="text-red-500 mt-1 text-center font-light">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="form-control w-full h-96 max-h-48 col-span-2">
                                                <label className="label">
                                                    <span className="label-text">Item Description</span>
                                                </label>
                                                <textarea
                                                    title="Item Description"
                                                    className="textarea w-fit"
                                                    {...register("description")}
                                                ></textarea>
                                                {errors.description && (
                                                    <p className="text-red-500 mt-1 text-center font-light">
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
                                                    <p className="text-red-500 mt-1 text-center font-light">
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
                                                    <p className="text-red-500 mt-1 text-center font-light">
                                                        {errors.quantity.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="form-control  w-full max-w-xs my-2">
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
                                            <div className="form-control w-full max-w-xs flex flex-row justify-center">
                                                <label className="label">
                                                    <span className="label-text">Image</span>
                                                </label>
                                                <input
                                                    title="Image"
                                                    type="file"
                                                    accept="image/*"
                                                    id="filecrt"
                                                    className="px-2 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:text-neutral-900 file:font-semibold file:bg-primary hover:file:bg-primary-focus file:duration-300 w-fit max-w-xs"
                                                />
                                            </div>
                                            <div className="form-control ml-2 w-full flex flex-row justify-between items-center max-w-xs">
                                                <span className="label-text">Is input required?</span>
                                                <input
                                                    title="Is input required?"
                                                    type="checkbox"
                                                    className="toggle"
                                                    {...register("inputRequired")}
                                                />
                                            </div>
                                            <div className="form-control w-full max-w-xs my-2">
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
                                                <div className="form-control w-full max-w-xs mx-auto">
                                                    <label className="label">
                                                        <span className="label-text">Type wanted input</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your input"
                                                        className="input input-bordered w-full max-w-xs text-primary-content"
                                                        {...register("input")}
                                                    />
                                                    {errors.input && (
                                                        <p className="text-red-500 mt-1 text-center font-light">
                                                            {errors.input.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flew-row justify-end gap-4 mt-6">
                                            <button type="submit" className="btn-prm-outline">
                                                Update
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

export default CreateItem;
