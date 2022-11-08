import { Role, type User } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "src/utils/trpc";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@schemas/user";
import ModalLoading from "./ModalLoading";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { CaretRight } from "phosphor-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { buttonStyle } from "@styles/button";
import { inputStyle } from "@styles/input";

// dynamic imports
const Image = dynamic(() => import("next/image"));

interface Users {
    user: User;
}

const UserModal = ({ user }: Users) => {
    const session = useSession();
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const [loading, setLoading] = useState(false);
    const utils = trpc.useContext();
    const { mutate } = trpc.user.update.useMutation({
        onSuccess: () => {
            utils.user.get.invalidate();
            setLoading(false);
            toast("User updated!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900",
            });
            closeModal();
        },
    });
    const {
        register,
        handleSubmit,
        getValues,
        reset,
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
        <>
            <button onClick={openModal} type="button" className={buttonStyle() + " mx-auto"}>
                Details
                <CaretRight size={22} weight="bold" className="my-auto" />
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
                                    <form className="text-center">
                                        <div className="flex justify-center">
                                            <div className="relative h-24 w-24">
                                                <Image
                                                    src={(user.image as string) || "/dalle.png"}
                                                    alt={user.name as string}
                                                    className="rounded-xl"
                                                    width={128}
                                                    height={128}
                                                />
                                            </div>
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>
                                        <span className="cursor-default text-lg font-semibold">
                                            ID:{" "}
                                            <span className="font-light blur duration-200 hover:blur-0">{user.id}</span>
                                        </span>
                                        <div className="my-2 mx-auto flex w-full max-w-xs flex-col">
                                            <span className="mb-1 font-light">Role</span>
                                            <select title="Role" className={inputStyle()} {...register("role")}>
                                                {Object.keys(Role).map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                        defaultChecked={role === user.role}
                                                        disabled={
                                                            Object.keys(Role).indexOf(
                                                                session.data?.user?.role.toString() as string,
                                                            ) >= Object.keys(Role).indexOf(role)
                                                        }
                                                    >
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.role && (
                                                <span className="mt-1 font-light text-red-500">
                                                    {errors.role.message}
                                                </span>
                                            )}
                                        </div>
                                        <div className="my-2 mx-auto flex w-full max-w-xs flex-col">
                                            <span className="mb-1 font-light">Points</span>
                                            <input
                                                title="Points"
                                                type="number"
                                                className={inputStyle()}
                                                {...register("points", {
                                                    setValueAs: (value) => BigInt(value),
                                                })}
                                            ></input>
                                            {errors.points && (
                                                <span className="mt-1 text-center font-light text-red-500">
                                                    {errors.points.message}
                                                </span>
                                            )}
                                        </div>
                                        <div className="my-2 mx-auto flex w-full max-w-xs flex-col">
                                            <span className="mb-1 text-center font-light">Cooldown</span>
                                            <input
                                                title="Cooldown"
                                                type="number"
                                                min="0"
                                                className={inputStyle()}
                                                {...register("cooldown", {
                                                    setValueAs: (value) => BigInt(value),
                                                })}
                                            ></input>
                                            <span className="mt-1 text-center font-light">
                                                You can calculate{" "}
                                                <Link href="https://www.epochconverter.com" className="text-violet-500">
                                                    there
                                                </Link>
                                            </span>
                                            {errors.cooldown && (
                                                <span className="mt-1 text-center font-light text-red-500">
                                                    {errors.cooldown.message}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-6 flex flex-row justify-end gap-4">
                                            <button
                                                type="button"
                                                className={buttonStyle({ theme: "success", outline: true })}
                                                onClick={handleSubmit(() => {
                                                    setLoading(true);
                                                    mutate(getValues());
                                                })}
                                            >
                                                Save
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

export default UserModal;
