import Image from "next/image";
import { Item, Role } from "@prisma/client";
import { useSession } from "next-auth/react";

interface ItemCard {
    item: Item;
    onClick?: () => void;
}

export const ItemCard = ({ item, onClick }: ItemCard) => {
    const session = useSession();
    return (
        <>
            <div className="card relative">
                <figure className="relative aspect-square w-full">
                    {item.image ? (
                        <Image
                            src={item.image}
                            layout="fill"
                            alt={item.name}
                            objectFit="contain"
                            className="rounded-t-xl"
                        />
                    ) : (
                        <h1 className="overflow-hidden break-words text-center text-4xl font-extrabold">{item.name}</h1>
                    )}
                </figure>
                <div className="max-h-40 items-center text-center">
                    <h2 className="m-2 text-2xl font-black">{item.name}</h2>
                    <div className="my-auto break-words">
                        <p>{item.price.toString()} Points</p>
                        <p>{item.quantity > 0 ? `${item.quantity} Left` : "Out Of Stock"}</p>
                    </div>
                    <button onClick={onClick} type="button" className="btn-prm m-2">
                        {session.data?.user?.role === Role.Admin ? "Edit" : "Get"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
