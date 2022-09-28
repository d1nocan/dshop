import { Transaction, User, Item, Status } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { default as TSA } from "@tables/transaction";
import Image from "next/image";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query/types/core";

interface Items {
    transaction: Transaction & { user: User; item: Item };
    index: number;
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult>;
}

export const UpdateTransaction = ({ transaction, index, refetch }: Items) => {
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState(transaction.status);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    const { mutate } = trpc.useMutation("transaction.update", {
        onSuccess: () => {
            refetch();
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
                                    <form>
                                        <Dialog.Title className="text-center font-black text-2xl mb-4">
                                            ID: {transaction.id}
                                        </Dialog.Title>
                                        <div className="flex flex-row justify-around border border-neutral-200 border-opacity-30 py-4 rounded shadow-lg">
                                            <div className="userinfo flex flex-col justify-center gap-4">
                                                <h1 className="text-center font-semibold">User</h1>
                                                <div className="flex justify-center">
                                                    <div className="w-24 h-24 relative">
                                                        <Image
                                                            src={transaction.user.image as string}
                                                            alt={transaction.user.name as string}
                                                            layout="fill"
                                                            className="rounded-3xl"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold text-center">
                                                    {transaction.user.name}
                                                </h3>
                                            </div>
                                            <div className="iteminfo flex flex-col justify-center gap-4">
                                                <h1 className="text-center font-semibold">Item</h1>
                                                <div className="flex justify-center">
                                                    <div className="w-24 h-24 relative">
                                                        <Image
                                                            src={transaction.item.image as string}
                                                            alt={transaction.item.name as string}
                                                            layout="fill"
                                                            className="rounded-3xl"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold text-center">
                                                    {transaction.item.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="border border-neutral-200 border-opacity-30 py-4 rounded shadow-lg my-4">
                                            {transaction.item.input && (
                                                <>
                                                    <p className="text-center mt-4 font-bold">Input</p>
                                                    <p className="text-center mt-4">
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
                                        <div className="forms border border-neutral-200 border-opacity-30 py-4 rounded shadow-lg my-4">
                                            <div className="form-control w-full max-w-xs mx-auto my-2">
                                                <span className="text-center font-light mb-1">Status</span>
                                                <Listbox value={status} onChange={setStatus}>
                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-neutral-100 dark:bg-neutral-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                        {status}
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
                                                        <Listbox.Options className="absolute cursor-default mt-16 max-h-60 w-1/3 overflow-auto rounded-md bg-neutral-100 dark:bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {Object.values(Status).map((status) => (
                                                                <Listbox.Option
                                                                    key={status}
                                                                    value={status}
                                                                    className="relative cursor-default select-none py-2 mx-auto hover:text-violet-500 duration-300"
                                                                >
                                                                    {status}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </Listbox>
                                            </div>
                                        </div>
                                        <div className="flex flew-row justify-end gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => mutate({ status: status, id: transaction.id })}
                                                className="btn-prm-outline"
                                            >
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

export default UpdateTransaction;
