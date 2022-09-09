import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "src/utils/trpc";
import dalle from "../../public/dalle.png";

export default function Navbar() {
  const { data: leaderboardData } = trpc.useQuery(["leaderboard.leaderboard"]);
  const { data: session } = useSession();
  return (
    <>
      <nav className="navbar">
        <div className="flex flex-col justify-around h-full">
          <div className="profile">
            <div className="card">
              {session && (
                <div className="profile">
                  <Image
                    src={session.user?.image || dalle}
                    width={75}
                    height={75}
                    className="rounded-full"
                    alt="profile"
                  />
                  <div className="my-auto">
                    <p className="primary-text text-left">
                      {session.user?.name}
                    </p>
                    <p className="secondary-text">
                      {session.user?.points} points
                    </p>
                  </div>
                </div>
              )}
              <button
                  className="primary-button"
                  type="button"
                  onClick={session ? () => signOut() : () => signIn()}
                >
                  {session ? "Sign out" : "Sign in"}
                </button>
              </div>
          </div>
          <div className="leaderboard overflow-auto">
              <p className="font-bold primary-text">
                Leaderboard
              </p>
              <table className="table-auto mx-auto w-full">
                <thead>
                  <tr>
                    <th className="w-1/2 py-2 primary-text">
                      Name
                    </th>
                    <th className="w-1/2 py-2 primary-text">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData?.map((user, index) => (
                    <tr key={index}>
                      <td className="py-2 secondary-text">
                        {user.name}
                      </td>
                      <td className="py-2 secondary-text">
                        {user.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </nav>
    </>
  );
}
