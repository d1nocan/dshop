import type { User } from "@prisma/client";
import { useState } from "react";
import dynamic from "next/dynamic";

interface UserCard {
    user: User;
    isAdmin: boolean;
}

const UserModal = dynamic(() => import("@modals/UserModal"));
const Image = dynamic(() => import("next/image"));
const Button = dynamic(() => import("@general/button"));

const UserCard = ({ user, isAdmin }: UserCard) => {
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
                            src={(user.image as string) ?? "/dalle.png"}
                            alt={user.name as string}
                            layout="fill"
                            priority
                            objectFit="contain"
                            className="rounded-xl"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOc2N29HwAFxAJoV+j/RAAAAABJRU5ErkJggg=="
                        />
                    </div>
                    <div className="max-h-40 items-center text-center">
                        <h2 className="m-2 break-all text-xl font-black">{user.name}</h2>
                        <p>Points: {user.points.toString()}</p>
                        <p>Role: {user.role}</p>
                        <div className="mt-2">
                            {isAdmin && (
                                <Button onClick={openModal} type="primary" className="px-2">
                                    Details
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <UserModal user={user} closeModal={closeModal} showModal={showModal} />}
        </>
    );
};

export default UserCard;
