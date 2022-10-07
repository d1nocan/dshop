import { Transaction, User, Item, Status, Role } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { default as TSA } from "@tables/transaction";
import Image from "next/image";
import Button from "@general/button";
import ModalLoading from "./ModalLoading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTransaction } from "@schemas/transaction";
import { useSession } from "next-auth/react";

interface Items {
    transaction: Transaction & { user: User; item: Item };
    index: number;
}

export const UpdateTransaction = ({ transaction, index }: Items) => {
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const utils = trpc.useContext();
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        resolver: zodResolver(updateTransaction),
        defaultValues: {
            id: transaction.id,
            status: transaction.status,
            response: transaction.response || "",
        },
    });
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { mutate } = trpc.transaction.update.useMutation({
        onSuccess: () => {
            utils.transaction.get.invalidate();
            reset();
            setLoading(false);
            closeModal();
        },
    });
    return (
        <>
            <TSA index={index} transaction={transaction} onClick={openModal} />
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
                                    {loading && <ModalLoading />}
                                    <form>
                                        <Dialog.Title className="mb-4 text-center text-2xl font-black">
                                            ID: {transaction.id}
                                        </Dialog.Title>
                                        <div className="flex flex-row justify-around rounded border border-neutral-200 border-opacity-30 py-4 shadow-lg">
                                            <div className="userinfo flex flex-col justify-center gap-4">
                                                <h1 className="text-center font-semibold">User</h1>
                                                <div className="flex justify-center">
                                                    <div className="relative h-24 w-24">
                                                        <Image
                                                            src={transaction.user.image as string}
                                                            alt={transaction.user.name as string}
                                                            layout="fill"
                                                            className="rounded-3xl"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-center text-lg font-semibold">
                                                    {transaction.user.name}
                                                </h3>
                                            </div>
                                            <div className="iteminfo flex flex-col justify-center gap-4">
                                                <h1 className="text-center font-semibold">Item</h1>
                                                <div className="flex justify-center">
                                                    <div className="relative h-24 w-24">
                                                        <Image
                                                            src={(transaction.item.image as string) || "/dalle.png"}
                                                            alt={transaction.item.name as string}
                                                            layout="fill"
                                                            className="rounded-3xl"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-center text-lg font-semibold">
                                                    {transaction.item.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="my-4 rounded border border-neutral-200 border-opacity-30 py-4 shadow-lg">
                                            {transaction.item.input && (
                                                <>
                                                    <p className="mt-4 text-center font-bold">Input</p>
                                                    <p className="mt-4 text-center">
                                                        {transaction.item.input}: {transaction.input}
                                                    </p>
                                                </>
                                            )}
                                            <p
                                                className={`text-center ${
                                                    transaction.item.input && "mt-4"
                                                } break-words`}
                                            >
                                                Time: {new Date(Number(transaction.createdAt)).toUTCString()}
                                            </p>
                                        </div>
                                        <div className="forms my-4 rounded border border-neutral-200 border-opacity-30 py-4 shadow-lg">
                                            <div className="input-area my-2 mx-auto w-full max-w-xs">
                                                <span className="mb-1 text-center font-light">Status</span>
                                                {transaction.status === Status.Pending &&
                                                session.data?.user?.role === Role.Admin ? (
                                                    <Listbox onChange={(e) => setValue("status", e as Status)}>
                                                        <Listbox.Button className="relative mx-auto w-60 cursor-default rounded-lg bg-neutral-100 py-2 pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-neutral-900 sm:text-sm">
                                                            {watch("status")}
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-100"
                                                            enterFrom="opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2"
                                                            enterTo="opacity-100 scale-100"
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100 scale-100"
                                                            leaveTo="opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2"
                                                        >
                                                            <Listbox.Options className="absolute mt-16 max-h-60 w-60 cursor-default overflow-auto rounded-md bg-neutral-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 sm:text-sm">
                                                                {Object.values(Status).map((status) => (
                                                                    <Listbox.Option
                                                                        key={status}
                                                                        value={status}
                                                                        className="relative mx-auto cursor-default select-none py-2 duration-300 hover:text-violet-500"
                                                                    >
                                                                        {status}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </Listbox>
                                                ) : (
                                                    <span className="mb-1 text-center font-light">
                                                        {transaction.status}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="input-area my-2 mx-auto w-full max-w-xs">
                                                <span className="mb-1 text-center font-light">Message</span>
                                                {transaction.status === Status.Pending &&
                                                session.data?.user?.role === Role.Admin ? (
                                                    <textarea
                                                        className="textarea"
                                                        title="Message"
                                                        rows={3}
                                                        {...register("response")}
                                                    />
                                                ) : (
                                                    <span className="mb-1 text-center font-light">
                                                        {transaction.response}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flew-row mt-6 flex justify-end gap-4">
                                            {transaction.status === Status.Pending &&
                                                session.data?.user?.role === Role.Admin && (
                                                    <Button
                                                        type="primary"
                                                        outline
                                                        onClick={handleSubmit((_data) => {
                                                            setLoading(true);
                                                            mutate(_data);
                                                        })}
                                                    >
                                                        Update
                                                    </Button>
                                                )}
                                            <Button type="danger" outline onClick={closeModal}>
                                                Close
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

export default UpdateTransaction;
