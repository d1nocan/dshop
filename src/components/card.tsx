import Image from "next/image";
import dalle from "../../public/dalle.png";

type CardProps = {
    title: string,
    description: string,
    image?: string,
    price: number,
};


const Card = ({title, description, image, price} : CardProps) => {
  return (
    <div className="w-72 h-96 flex flex-col rounded-xl justify-between bg-neutral-100 dark:bg-neutral-800 shadow-2xl overflow-auto">
      <figure>
        <Image src={image || dalle} width={400} height={225} alt="product" />
      </figure>
      <div className="pl-4 pb-4 pt-4 overflow-hidden mb-7">
        <h1 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg mb-1">
            {title}
        </h1>
        <p className="border border-neutral-900 dark:border-neutral-50 rounded-xl text-sm align-middle font-light px-2 text-neutral-900 dark:text-neutral-100 inline-block">{price} Points</p>
        <p className="text-neutral-700 dark:text-neutral-100 break-words mt-2">
          {description}
        </p>
      </div>
        <button className="bg-palette-200 text-neutral-100 w-full py-2 font-semibold rounded-md">Details</button>
    </div>
  );
};

export default Card;
