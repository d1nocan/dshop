/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { Item, User, Role } from "@prisma/client";
import { useRouter } from "next/router";
import { BuyModal, EditModal, UserModal } from "@components/modal";
import { useState } from "react";
import { Session } from "next-auth";

interface ItemCard {
  item: Item;
}

interface UserCard {
  user: User;
  session: Session | null;
}

export const ItemCard = ({ item }: ItemCard) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="card w-60 bg-base-200 shadow-xl">
        <figure className="relative aspect-square">
          {item.image ? (
            <Image
              src={item.image}
              layout="fill"
              alt="product"
              objectFit="contain"
            />
          ) : (
            <h1 className="text-4xl text-center font-extrabold break-words overflow-hidden">
              {item.name}
            </h1>
          )}
        </figure>
        <div className="card-body max-h-52">
          <h2 className="card-title">{item.name}</h2>
          <p className="break-all font-light">{item.description}</p>
          <div className="card-actions justify-between">
            <div className="my-auto break-words">
              <p className="font-light">{item.price.toString()} Points</p>
              <p className="font-light">
                {item.quantity > 0 ? `${item.quantity} Left` : "Out Of Stock"}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="btn btn-circle btn-primary z-10"
            >
              {router.pathname.includes("dashboard") ? "Edit" : "Get"}
            </button>
          </div>
        </div>
      </div>
      {showModal &&
        (!router.pathname.includes("dashboard") ? (
          <BuyModal item={item} setShowModal={setShowModal} />
        ) : (
          <EditModal item={item} setShowModal={setShowModal} />
        ))}
    </>
  );
};

export const UserCard = ({ user, session }: UserCard) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="card w-72 bg-base-100 shadow-xl">
        <figure className="p-12 mt-4 relative mx-auto">
          <Image
            src={user.image as string}
            alt={user.name as string}
            layout="fill"
            className="rounded-xl"
            objectFit="contain"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{user.name}</h2>
          <p>Points: {user.points.toString()}</p>
          <p className="">Role: {user.role}</p>
          <div className="card-actions">
            {session?.user?.role === Role.Admin && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                Details
              </button>
            )}
          </div>
        </div>
      </div>
      {showModal && <UserModal user={user} setShowModal={setShowModal} />}
    </>
  );
};
