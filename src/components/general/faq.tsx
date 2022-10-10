import { Disclosure, Transition } from "@headlessui/react";
import { CaretDown } from "phosphor-react";
export default function FAQ() {
    return (
        <div className="w-full px-4 pt-16">
            <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white p-2 dark:bg-neutral-800">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-neutral-50 px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:bg-neutral-900 dark:text-neutral-100">
                                <span>I bought a product. When will it reach me?</span>
                                <span className={`${open ? "rotate-180" : ""} scale-75 duration-100`}>
                                    <CaretDown weight="bold" size={16} />
                                </span>
                            </Disclosure.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-y-0 opacity-0"
                                enterTo="transform scale-y-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-y-100 opacity-100"
                                leaveTo="transform scale-y-0 opacity-0"
                            >
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-neutral-300">
                                    We try to deliver the products quickly. It may take up to 5 business days for the
                                    product to reach you.
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-neutral-50 px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:bg-neutral-900 dark:text-neutral-100">
                                <span>How can I earn points?</span>
                                <span className={`${open ? "rotate-180" : ""} scale-75 duration-100`}>
                                    <CaretDown weight="bold" size={16} />
                                </span>
                            </Disclosure.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-y-0 opacity-0"
                                enterTo="transform scale-y-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-y-100 opacity-100"
                                leaveTo="transform scale-y-0 opacity-0"
                            >
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-neutral-300">
                                    You can earn points by watching live streams, redeeming codes or by joining any
                                    event.
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    );
}
