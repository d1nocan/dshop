import type { NextPage } from "next";
import { useState } from "react";
import { ItemCard } from "@components/card";
import { CreateModal } from "@components/modal";
import { trpc } from "@utils/trpc";

const Items: NextPage = () => {
    const [showModal, setShowModal] = useState(false);
    const { data } = trpc.useQuery(["item.get"]);
    return (
        <>
            {showModal && (
                <div className="ease-in-out">
                    <CreateModal setShowModal={setShowModal} />
                </div>
            )}
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn btn-primary flex mx-auto w-36 mt-10"
            >
                Create Item
            </button>
            <div className="flex flex-row py-10 gap-4 justify-center flex-shrink-0 flex-wrap">
                {data?.map((item, index) => (
                    <ItemCard key={index} item={item} />
                ))}
                {data?.length === 0 && (
                    <div className="alert alert-info w-40 mx-auto justify-center mt-10 shadow-lg">
                        <div>
                            <span>No item found</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Items;
