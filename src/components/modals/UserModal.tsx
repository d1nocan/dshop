import { Role, User } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@schemas/user";
import UserCard from "@cards/UserCard";
import { Session } from "next-auth";

interface Users {
    user: User;
    session: Session | null;
}

const UserModal = ({ user, session }: Users) => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const utils = trpc.useContext();
    const { mutate } = trpc.useMutation("user.update", {
        onSuccess: () => {
            utils.queryClient.resetQueries(["user.get"]);
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
            <UserCard user={user} session={session} onClick={openModal} />
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
                                    <form onSubmit={handleSubmit(() => mutate(getValues()))}>
                                        <Dialog.Title>
                                            <div className="flex justify-center">
                                                <div className="w-24 h-24 relative">
                                                    <Image
                                                        src={user.image as string}
                                                        alt={user.name as string}
                                                        layout="fill"
                                                        className="rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-center">{user.name}</h3>
                                            <p className="text-lg font-light text-center blur hover:blur-0 duration-200">
                                                ID: {user.id}
                                            </p>
                                        </Dialog.Title>
                                        <Dialog.Description>
                                            <div className="flex flex-col w-full max-w-xs mx-auto my-2">
                                                <span className="text-center font-light mb-1">Role</span>
                                                <select title="Role" className="input" {...register("role")}>
                                                    {Object.keys(Role).map((role, index) => (
                                                        <option key={index} value={role} selected={role === user.role}>
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
                                            <div className="flex flex-col w-full max-w-xs mx-auto my-2">
                                                <span className="text-center font-light mb-1">Points</span>
                                                <input
                                                    title="Points"
                                                    type="number"
                                                    className="input"
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
                                            <div className="flex flex-col w-full max-w-xs mx-auto my-2">
                                                <span className="text-center font-light mb-1">Cooldown</span>
                                                <input
                                                    title="Cooldown"
                                                    type="number"
                                                    min="0"
                                                    className="input"
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
                                        </Dialog.Description>
                                        <div className="flex flex-row justify-end gap-4 mt-6">
                                            <button type="submit" className="btn-prm-outline">
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="btn-can-outline"
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
