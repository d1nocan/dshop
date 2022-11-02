import type { User } from "@prisma/client";
import dynamic from "next/dynamic";

interface UserCard {
    user: User;
    isAdmin: boolean;
    userid?: string;
}

const UserModal = dynamic(() => import("@modals/UserModal"));
const Image = dynamic(() => import("next/image"));

const UserCard = ({ user, isAdmin, userid }: UserCard) => {
    return (
        <>
            <div className="card">
                <div className="card-body relative">
                    <div className="image-box">
                        <Image
                            src={(user.image as string) ?? "/dalle.png"}
                            alt={user.name as string}
                            className="rounded-xl"
                            placeholder="blur"
                            loading="lazy"
                            width={128}
                            height={128}
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOc2N29HwAFxAJoV+j/RAAAAABJRU5ErkJggg=="
                        />
                    </div>
                    <div className="max-h-40 items-center text-center">
                        <h2 className="m-2 break-all text-xl font-black">{user.name}</h2>
                        <p>Points: {user.points.toString()}</p>
                        <p>Role: {user.role}</p>
                        <div className="mt-2">{isAdmin && userid !== user.id && <UserModal user={user} />}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserCard;
