import Image from "next/image";
import { User, Role } from "@prisma/client";
import { Session } from "next-auth";

interface UserCard {
    user: User;
    session: Session | null;
    onClick?: () => void;
}
export const UserCard = ({ user, session, onClick }: UserCard) => {
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
                            {session?.user?.role === Role.Admin && (
                                <button type="button" onClick={onClick} className="btn-prm">
                                    Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserCard;
