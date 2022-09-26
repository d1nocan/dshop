import { Item, Role, Status, Transaction, User } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { updateItem, createItem, selectItem } from "@schemas/item";
import { zodResolver } from "@hookform/resolvers/zod";
import uploadImage from "@utils/supabase";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { updateUser } from "@schemas/user";
import { updateTransaction } from "@schemas/transaction";

interface Items {
  item: Item;
}

interface Transactions {
  transaction: Transaction & { item: Item; user: User };
}

interface Users {
  user: User;
}

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const BuyModal = ({ item, setShowModal }: Items & ModalProps) => {
  const utils = trpc.useContext();
  const { mutate, error } = trpc.useMutation("item.buy", {
    onSuccess: () => {
      utils.queryClient.resetQueries(["item.get"]);
      setShowModal(false);
    },
  });
  const { register, handleSubmit, getValues } = useForm({
    resolver: zodResolver(selectItem),
    defaultValues: {
      id: item.id,
      input: "",
    },
  });
  return (
    <form
      onSubmit={handleSubmit(() => {
        mutate(getValues());
      })}
    >
      <div className="modal cursor-pointer modal-open">
        <div className="modal-box relative">
          <div className="p-4 text-primary-content z-10 relative">
            <h3 className="text-lg font-extrabold text-center">{item.name}</h3>
            <p className="py-4 break-words text-center">{item.description}</p>
            <p className="pt-5 pb-2">Price: {Number(item.price)}</p>
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
            {error && (
              <p className="text-red-500 text-center">{error.message}</p>
            )}
            <div className="modal-action">
              <button type="submit" className="btn btn-outline btn-success">
                Buy
              </button>
              <a
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-error"
              >
                Cancel
              </a>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export const EditModal = ({ item, setShowModal }: Items & ModalProps) => {
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
      cooldown: item.cooldown / 1000,
      isHidden: item.isHidden,
    },
  });
  return (
    <>
      <form
        onSubmit={handleSubmit(async () => {
          const filelist = (
            document.getElementById(`fileupl-${item?.id}`) as HTMLInputElement
          ).files as FileList;
          if (filelist.length > 0) {
            const link = (await uploadImage(filelist)) as string;
            setValue("image", link);
          }
          setValue("cooldown", getValues("cooldown") * 1000);
          mutate(getValues());
          reset();
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
                <div className="form-control w-full max-w-xs -mt-6">
                  <label className="label">
                    <span className="label-text">Image</span>
                  </label>
                  <input
                    title="Image"
                    type="file"
                    accept="image/*"
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
              <div className="modal-action">
                <button className="btn btn-outline btn-success" type="submit">
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
                <a
                  href="#"
                  onClick={() => {
                    reset();
                    setShowModal(false);
                  }}
                  className="btn btn-outline btn-warning"
                >
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

export const CreateModal = ({ setShowModal }: ModalProps) => {
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
        const filelist = (
          document.getElementById("filecrt") as HTMLInputElement
        ).files as FileList;
        if (filelist.length > 0) {
          const link = (await uploadImage(filelist)) as string;
          setValue("image", link);
          mutate(getValues());
        } else {
          mutate(getValues());
        }
        reset();
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
            {error && <p className="text-red-500">{error.message}</p>}
            <div className="modal-action">
              <button className="btn btn-outline btn-success" type="submit">
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                }}
                className="btn btn-outline btn-error"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export const UserModal = ({ user, setShowModal }: Users & ModalProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation("user.update", {
    onSuccess: () => {
      utils.queryClient.resetQueries(["user.get"]);
      setShowModal(false);
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUser),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      points: user.points,
      cooldown: user.cooldown,
    },
  });
  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <form
          onSubmit={handleSubmit(() => {
            mutate(getValues());
          })}
        >
          <div className="p-4 text-base-content z-10 relative cursor-default">
            <div className="info flex flex-col justify-center gap-4 border border-base-content border-opacity-30 py-4 rounded shadow-lg my-4">
              <div className="avatar flex justify-center">
                <div className="w-24 rounded-full relative">
                  <Image
                    src={user.image as string}
                    alt={user.name as string}
                    layout="fill"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center">{user.name}</h3>
              <p className="text-lg font-light text-center blur hover:blur-0 duration-200">
                ID: {user.id}
              </p>
            </div>
            <div className="forms border border-base-content border-opacity-30 py-4 rounded shadow-lg my-4">
              <div className="form-control w-full max-w-xs mx-auto my-2">
                <span className="text-center font-light mb-1">Role</span>
                <select
                  title="Role"
                  className="select select-bordered w-5/12 max-w-xs mx-auto"
                  {...register("role")}
                >
                  {Object.keys(Role).map((role, index) => (
                    <option
                      key={index}
                      value={role}
                      selected={role === user.role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 mt-1 text-center font-light">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className="form-control w-full max-w-xs mx-auto my-2">
                <span className="text-center font-light mb-1">Points</span>
                <input
                  title="Points"
                  type="number"
                  className="input w-3/6 text-center mx-auto input-sm input-bordered"
                  {...register("points", {
                    setValueAs: (value) => BigInt(value),
                  })}
                ></input>
                {errors.points && (
                  <p className="text-red-500 mt-1 text-center font-light">
                    {errors.points.message}
                  </p>
                )}
              </div>
              <div className="form-control w-full max-w-xs mx-auto my-2">
                <span className="text-center font-light mb-1">Cooldown</span>
                <input
                  title="Cooldown"
                  type="number"
                  min="0"
                  className="input w-3/6 text-center mx-auto input-sm input-bordered"
                  {...register("cooldown", {
                    setValueAs: (value) => BigInt(value),
                  })}
                ></input>
                {errors.cooldown && (
                  <p className="text-red-500 mt-1 text-center font-light">
                    {errors.cooldown.message}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-outline btn-success">
                Save
              </button>
              <a
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-error"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TransactionModal = ({
  transaction,
  setShowModal,
}: Transactions & ModalProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation("transaction.update", {
    onSuccess: () => {
      utils.queryClient.resetQueries(["transaction.get"]);
      setShowModal(false);
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateTransaction),
    defaultValues: {
      id: transaction.id,
      status: transaction.status,
    },
  });
  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <form
          onSubmit={handleSubmit(() => {
            mutate(getValues());
          })}
        >
          <div className="p-4 text-base-content z-10 relative">
            <div className="flex flex-row justify-around border border-base-content border-opacity-30 py-4 rounded shadow-lg">
              <div className="userinfo flex flex-col justify-center gap-4">
                <h1 className="text-center font-semibold">User</h1>
                <div className="avatar flex justify-center">
                  <div className="w-24 rounded-full relative">
                    <Image
                      src={transaction.user.image as string}
                      alt={transaction.user.name as string}
                      layout="fill"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center">
                  {transaction.user.name}
                </h3>
              </div>
              <div className="iteminfo flex flex-col justify-center gap-4">
                <h1 className="text-center font-semibold">Item</h1>
                <div className="avatar flex justify-center">
                  <div className="w-24 rounded-full relative">
                    <Image
                      src={transaction.item.image as string}
                      alt={transaction.item.name as string}
                      layout="fill"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center">
                  {transaction.item.name}
                </h3>
              </div>
            </div>
            <div className="border border-base-content border-opacity-30 py-4 rounded shadow-lg my-4">
              {transaction.item.input && (
                <>
                  <p className="text-center mt-4 font-bold">Input</p>
                  <p className="text-center mt-4">
                    {transaction.item.input}: {transaction.input}
                  </p>
                </>
              )}
              <p className="text-center mt-4 break-words">
                Time: {new Date(Number(transaction.createdAt)).toUTCString()}
              </p>
            </div>
            <div className="forms border border-base-content border-opacity-30 py-4 rounded shadow-lg my-4">
              <div className="form-control w-full max-w-xs mx-auto my-2">
                <span className="text-center font-light mb-1">Status</span>
                <select
                  title="Status"
                  className="select select-bordered w-5/12 max-w-xs mx-auto"
                  {...register("status")}
                >
                  {Object.keys(Status).map((status, index) => (
                    <option
                      key={index}
                      value={status}
                      selected={status === transaction.status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-500 mt-1 text-center font-light">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-outline btn-success">
                Update
              </button>
              <a
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-error"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
