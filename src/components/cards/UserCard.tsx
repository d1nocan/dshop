import Image from "next/image";
import { User } from "@prisma/client";
import { useState } from "react";
import dynamic from "next/dynamic";

interface UserCard {
    user: User;
    isAdmin: boolean;
    refetch: () => void;
}

const UserModal = dynamic(() => import("@modals/UserModal"));

export const UserCard = ({ user, isAdmin, refetch }: UserCard) => {
    const [showModal, setShowModal] = useState(false);
    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
    }
    return (
        <>
            <div className="card">
                <div className="card-body relative">
                    <div className="image-box">
                        <Image
                            src={user.image as string}
                            alt={user.name as string}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-xl"
                        />
                    </div>
                    <div className="max-h-40 items-center text-center">
                        <h2 className="m-2 text-2xl font-semibold">{user.name}</h2>
                        <p>Points: {user.points.toString()}</p>
                        <p>Role: {user.role}</p>
                        <div className="mt-2">
                            {isAdmin && (
                                <button type="button" onClick={openModal} className="btn-prm">
                                    Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <UserModal user={user} refetch={refetch} closeModal={closeModal} showModal={showModal} />}
        </>
    );
};

export default UserCard;
