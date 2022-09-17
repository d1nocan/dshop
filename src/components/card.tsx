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
    <div className="card w-64 bg-base-100 shadow-xl">
  <figure className="relative w-full h-48"><Image src={image || dalle} layout="fill" alt="product" /></figure>
  <div className="card-body">
    <h2 className="card-title">{title}{isHidden && (<p className="text-sm my-auto text-red-600">Gizli</p>)}</h2>
    <p className="truncate">{description}</p>
    <div className="card-actions justify-end">
      <p className="my-auto">{price} Points</p>
      {isHidden === undefined ? (<button type="button" className="btn btn-primary">Details</button>) : (<button type="button" className="btn btn-primary">Edit</button>)}
    </div>
  </div>
</div>
  );
};

export default Card;
