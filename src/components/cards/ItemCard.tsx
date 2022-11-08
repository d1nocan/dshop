import type { Item } from "@prisma/client";
import dynamic from "next/dynamic";
interface ItemCard {
    item: Item;
    isAdmin: boolean;
    isGuest: boolean;
}
const Image = dynamic(() => import("next/image"));
const EditItem = dynamic(() => import("@modals/EditItem"));
const BuyItem = dynamic(() => import("@modals/BuyItem"));

export const ItemCard = ({ item, isGuest, isAdmin }: ItemCard) => {
    return (
        <>
            <div className="card relative">
                {/* <div className="absolute z-0 invisible -inset-1 animate-pulse bg-gradient-to-r from-indigo-300 to-purple-400 blur-sm xl:visible "></div> */}
                <div className="card-body relative">
                    {isAdmin && <EditItem item={item} />}
                    <figure className="image-box">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="rounded-xl"
                                width={128}
                                height={128}
                            />
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
                        {!isGuest && <BuyItem item={item} isGuest={isGuest} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
