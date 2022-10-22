import type { Item } from "@prisma/client";
import { useState } from "react";
import dynamic from "next/dynamic";
interface ItemCard {
    item: Item;
    isAdmin: boolean;
    isGuest: boolean;
}

export const ItemCard = ({ item, isGuest, isAdmin }: ItemCard) => {
    const EditItem = dynamic(() => import("@modals/EditItem"));
    const BuyItem = dynamic(() => import("@modals/BuyItem"));
    const Image = dynamic(() => import("next/image"));
    const Pencil = dynamic(() => import("phosphor-react").then((p) => p.Pencil));
    const ShoppingBag = dynamic(() => import("phosphor-react").then((p) => p.ShoppingBag));
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    return (
        <>
            <div className="card relative">
                {/* <div className="absolute z-0 invisible -inset-1 animate-pulse bg-gradient-to-r from-indigo-300 to-purple-400 blur-sm xl:visible "></div> */}
                <div className="card-body relative">
                    <figure className="image-box">
                        {item.image ? (
                            <Image src={item.image} layout="fill" alt={item.name} className="rounded-xl" />
                        ) : (
                            <h1 className="overflow-hidden break-words text-center text-3xl font-extrabold">
                                {item.name}
                            </h1>
                        )}
                    </figure>
                    <div className="items-center text-center">
                        <h2 className="m-2 text-2xl font-semibold">{item.name}</h2>
                        <div className="my-auto break-words">
                            <p>{item.price.toString()} Points</p>
                            {!isGuest && (
                                <p>
                                    {item.quantity !== 0
                                        ? item.quantity === -1
                                            ? "∞ Left"
                                            : `${item.quantity} Left`
                                        : "Out Of Stock"}
                                </p>
                            )}
                        </div>
                        {!isGuest && (
                            <button
                                onClick={openModal}
                                type="button"
                                className="button primary mx-auto mt-2 flex gap-2"
                            >
                                {isAdmin ? (
                                    <>
                                        Edit <Pencil size={18} className="my-auto" />
                                    </>
                                ) : (
                                    <>
                                        Get <ShoppingBag size={18} className="my-auto" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isAdmin ? (
                <EditItem item={item} closeModal={closeModal} showModal={showModal} />
            ) : (
                <BuyItem item={item} closeModal={closeModal} showModal={showModal} isGuest={isGuest} />
            )}
        </>
    );
};

export default ItemCard;
