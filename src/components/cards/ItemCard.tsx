import Image from "next/image";
import { Item } from "@prisma/client";
import { useRouter } from "next/router";

interface ItemCard {
    item: Item;
    onClick?: () => void;
}

export const ItemCard = ({ item, onClick }: ItemCard) => {
    const router = useRouter();
    return (
        <>
            <div className="card relative">
                <figure className="relative w-full h-40">
                    {item.image ? (
                        <Image
                            src={item.image}
                            layout="fill"
                            alt={item.name}
                            objectFit="inherit"
                            className="rounded-t-xl"
                        />
                    ) : (
                        <h1 className="text-4xl text-center font-extrabold break-words overflow-hidden">{item.name}</h1>
                    )}
                </figure>
                <div className="items-center text-center max-h-40">
                    <h2 className="font-black text-2xl m-2">{item.name}</h2>
                    <div className="my-auto break-words">
                        <p>{item.price.toString()} Points</p>
                        <p>{item.quantity > 0 ? `${item.quantity} Left` : "Out Of Stock"}</p>
                    </div>
                    <button onClick={onClick} type="button" className="btn-prm m-2">
                        {router.pathname.includes("dashboard") ? "Edit" : "Get"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
