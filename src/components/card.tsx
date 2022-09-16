import Image from "next/image";
import dalle from "../../public/dalle.png";

type CardProps = {
    title: string,
    description: string,
    image?: string,
    price: number,
    isHidden?: boolean | null,
};


const Card = ({title, description, image, price, isHidden} : CardProps) => {
  return (
    <div className="flex flex-col justify-between w-4/12 overflow-auto shadow-2xl rounded-xl bg-neutral-100 dark:bg-neutral-800">
      <figure className="relative w-full h-48">
        <Image src={image || dalle} layout="fill" alt="product" />
      </figure>
      <div className="relative pt-4 pb-6 pl-4 my-auto overflow-hidden mb-7">
        <h1 className="mb-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {title}
        </h1>
        <p className="inline-block px-2 text-sm font-light align-middle border border-neutral-900 dark:border-neutral-50 rounded-xl text-neutral-900 dark:text-neutral-100">{price} Points</p>
        <p className="mt-2 break-words text-neutral-700 dark:text-neutral-100">
          {description}
        </p>
        {isHidden && (<p className="absolute mb-2 text-red-600">Gizli</p>)}
      </div>
        <button type="button" className="w-full py-2 font-semibold rounded-md bg-palette-200 text-neutral-100">Details</button>
    </div>
  );
};

export default Card;
