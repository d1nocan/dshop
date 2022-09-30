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
                <div className="invisible absolute -inset-1 z-0 animate-pulse bg-gradient-to-r from-indigo-300 to-purple-400 blur xl:visible "></div>
                <div className="card-body relative">
                    <figure className="image-box">
                        {item.image ? (
                            <Image
                                src={item.image}
                                layout="fill"
                                alt={item.name}
                                objectFit="contain"
                                className="rounded-xl"
                            />
                        ) : (
                            <h1 className="overflow-hidden break-words text-center text-4xl font-extrabold">
                                {item.name}
                            </h1>
                        )}
                    </figure>
                    <div className="items-center text-center">
                        <h2 className="m-2 text-2xl font-semibold">{item.name}</h2>
                        <div className="my-auto break-words">
                            <p>{item.price.toString()} Points</p>
                            <p>{item.quantity > 0 ? `${item.quantity} Left` : "Out Of Stock"}</p>
                        </div>
                        <button onClick={onClick} type="button" className="btn-prm m-2">
                            {session.data?.user?.role === Role.Admin ? "Edit" : "Get"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
