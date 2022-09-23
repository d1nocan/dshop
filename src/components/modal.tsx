import { Item } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { updateItem, createItem, selectItem } from "@schemas/item";
import { zodResolver } from "@hookform/resolvers/zod";
import uploadImage from "src/utils/supabase";
import { Dispatch, SetStateAction } from "react";

interface ChildProps {
    item: Item;
    setShowModal: Dispatch<SetStateAction<boolean>>
}

interface CreateProp {
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const BuyModal = ({ item, setShowModal }: ChildProps) => {
    const utils = trpc.useContext();
    const { mutate, error } = trpc.useMutation("item.buy", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            setShowModal(false);
        },
    });
    const { register, handleSubmit, getValues } = useForm({
        resolver: zodResolver(selectItem),
        defaultValues:
        {
            id: item.id,
            input: "",
        },
    });
    return (
        <form onSubmit={handleSubmit(() => {
            mutate(getValues());
        })}>
            <div className="modal cursor-pointer modal-open">
                <div className="modal-box relative">
                    <div className="p-4 text-primary-content z-10 relative">
                        <h3 className="text-lg font-extrabold text-center">{item.name}</h3>
                        <p className="py-4 break-words text-center">{item.description}</p>
                        <p className="pt-5 pb-2">Price: {item.price}</p>
                        <p className="py-2">Quantity: {item.quantity}</p>
                        {item.inputRequired && (
                            <div className="form-control w-full max-w-xs my-2 mx-auto">
                                <label className="label">
                                    <span className="label-text text-primary-content mx-auto">
                                        {item.input}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={"Enter " + item.input}
                                    className="input input-bordered border-2 input-primary w-full max-w-xs text-primary-content"
                                    {...register("input")}
                                />
                            </div>
                        )}
                        {error && <p className="text-red-500">{error.message}</p>}
                        <div className="modal-action">
                            <button
                                type="submit"
                                className="btn btn-outline btn-success"
                            >
                                Buy
                            </button>
                            <a onClick={() => setShowModal(false)} className="btn btn-outline btn-error">
                                Cancel
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export const EditModal = ({item, setShowModal}: ChildProps) => {
    const utils = trpc.useContext();
    const { mutate } = trpc.useMutation("item.update", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            setShowModal(false);
        },
    });
    const { mutate: deleteMutate } = trpc.useMutation("item.delete", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            setShowModal(false);
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
    return (
        <>
            <form
                onSubmit={handleSubmit(async () => {
                    const filelist = (document.getElementById(`fileupl-${item?.id}`) as HTMLInputElement).files as FileList;
                    if (filelist.length > 0) {
                        const link = await uploadImage(filelist) as string;
                        setValue("image", link);
                        console.log(getValues());
                        mutate(getValues());
                    }
                    else {
                        mutate(getValues());
                    }
                    reset()
                })}
            >
                <div className="modal cursor-pointer modal-open">
                    <div className="modal-box max-w-3xl text-primary-content relative">
                        <div className="px-4 z-10 relative">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center items-center place-items-center">
                                <div className="form-control w-full max-w-xs">
                                    <label className="label">
                                        <span className="label-text">Item Name</span>
                                    </label>
                                    <input
                                        title="Item Name"
                                        type="text"
                                        className="input input-bordered w-full max-w-xs"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 mt-1 text-center font-light">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="form-control w-full max-w-xs">
                                    <label className="label">
                                        <span className="label-text">Item Description</span>
                                    </label>
                                    <textarea
                                        title="Item Description"
                                        className="textarea textarea-bordered h-10"
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
                                        {...register("price", { valueAsNumber: true })}
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
                                            type="text"
                                            className="input input-bordered w-full max-w-xs"
                                            {...register("quantity")}
                                        />
                                    <label className="label">
                                        <span className="label-text-alt">Seconds</span>
                                    </label>
                                </div>
                                <div className="form-control w-full max-w-xs -mt-6">
                                    <label className="label">
                                        <span className="label-text">Image</span>
                                    </label>
                                    <input
                                        title="Image"
                                        type="file"
                                        id={`fileupl-${item?.id}`}
                                        className="block px-2 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:text-primary-content file:font-semibold file:bg-primary hover:file:bg-primary-focus file:duration-300 w-full max-w-xs"
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
                                {(watch("inputRequired") as unknown as string[]).length > 0 && (
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
                            <div className="modal-action">
                                <button className="btn btn-outline btn-success" type="submit" onClick={() => document.getElementById(`${item?.id}`)?.classList.add("opacity-10")}>
                                    Update
                                </button>
                                <button
                                    className="btn btn-outline btn-error"
                                    type="button"
                                    onClick={() => {
                                        deleteMutate({ id: item.id });
                                        setShowModal(false);
                                    }}
                                >
                                    Delete
                                </button>
                                <a href="#" onClick={() => {reset(); setShowModal(false);}} className="btn btn-outline btn-warning">
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export const CreateModal = ({setShowModal}: CreateProp) => {
    const utils = trpc.useContext();
    const { mutate, error } = trpc.useMutation("item.create", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["item.get"]);
            setShowModal(false);
        },
    });
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createItem),
        defaultValues: {
            name: "",
            description: "",
            input: "",
            image: "",
            price: 0,
            quantity: 0,
            cooldown: 0,
            inputRequired: false,
            isHidden: true,
        },
    });
    return (
        <form
            onSubmit={handleSubmit(async () => {
                const filelist = (document.getElementById("filecrt") as HTMLInputElement)
                    .files as FileList;
                if (filelist.length > 0) {
                    const link = await uploadImage(filelist) as string;
                    setValue("image", link);
                    console.log(getValues());
                    mutate(getValues());
                }
                else {
                    mutate(getValues());
                }
                reset()
            })}
        >
            <div id="create" className="modal cursor-pointer modal-open">
                <div className="modal-box w-11/12 max-w-3xl text-primary-content relative">
                    <div className="px-4 z-10 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center items-center place-items-center">
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Item Name</span>
                                </label>
                                <input
                                    title="Item Name"
                                    type="text"
                                    className="input input-bordered w-full max-w-xs"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-red-500 mt-1 text-center font-light">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Item Description</span>
                                </label>
                                <textarea
                                    title="Item Description"
                                    className="textarea textarea-bordered h-10"
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
                                    {...register("price", { valueAsNumber: true })}
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
                                            type="text"
                                            className="input input-bordered w-full max-w-xs"
                                            {...register("quantity")}
                                        />
                                    <label className="label">
                                        <span className="label-text-alt">Seconds</span>
                                    </label>
                                </div>
                            <div className="form-control w-full max-w-xs -mt-6">
                                <label className="label">
                                    <span className="label-text">Image</span>
                                </label>
                                <input
                                    title="Image"
                                    type="file"
                                    id="filecrt"
                                    className="block px-2 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:text-primary-content file:font-semibold file:bg-primary hover:file:bg-primary-focus file:duration-300 w-full max-w-xs"
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
                            {(watch("inputRequired") as unknown as string[]).length > 0  && (
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
                        {error && <p className="text-red-500">{error.message}</p>}
                        <div className="modal-action">
                            <button className="btn btn-outline btn-success" type="submit">
                                Create
                            </button>
                            <button type="button" onClick={() => {setShowModal(false)}} className="btn btn-outline btn-error">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

