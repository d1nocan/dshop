import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "src/utils/trpc";
import dalle from "../../public/dalle.png";

export default function Navbar() {
  const {data: leaderboardData} = trpc.useQuery(["leaderboard.leaderboard"]);
  const { data: session } = useSession();
  return (
    <>
      <nav className="w-[13%] h-screen overflow-auto p-4 absolute left-0 dark:bg-neutral-800 bg-neutral-200 z-10 duration-200">
        <div className="flex flex-col h-full">
          <div className="profile flex-1">
            {session ? (
              <>
                <div className="w-5/6 h-2/6 place-self-center mx-auto my-14 py-10 text-center duration-300 dark:bg-neutral-700 bg-neutral-400 rounded-md shadow-xl bg-opacity-70">
                  <Image
                    src={session.user?.image || dalle}
                    width={100}
                    height={100}
                    alt="profile"
                  />
                  <p className="font-bold dark:text-neutral-100 duration-300">
                    {session.user?.name}
                  </p>
                  <p className="font-medium dark:text-neutral-100 duration-300">
                    {session.user?.points} points
                  </p>
                </div>
              </>
            ) : (
              <div className="w-5/6 mx-auto my-14 py-10 text-center rounded-xl dark:bg-neutral-700 bg-neutral-400">
                <button
                  className="px-2 py-1 text-neutral-50 text-xl rounded-md bg-palette-300 hover:bg-palette-200 shadow-lg duration-300"
                  onClick={session ? () => signOut() : () => signIn()}
                >
                  {session ? "Sign out" : "Sign in"}
                </button>
              </div>
            )}
          </div>

          <div className="leaderboard overflow-auto">
            <div className="w-full place-self-center mx-auto pt-6 pb-4 text-center duration-300 dark:bg-neutral-700 bg-neutral-400 rounded-md shadow-xl bg-opacity-70">
              <p className="font-bold dark:text-neutral-100 duration-300">
                Leaderboard
              </p>
              <table className="table-auto mx-auto w-full">
                <thead>
                  <tr>
                    <th className="w-1/2 py-2 dark:text-neutral-100 duration-300">
                      Name
                    </th>
                    <th className="w-1/2 py-2 dark:text-neutral-100 duration-300">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {leaderboardData?.map((user, index) => (
                        <tr key={index}>
                            <td className="w-1/2 py-2 dark:text-neutral-100 duration-300">{user.name}</td>
                            <td className="w-1/2 py-2 dark:text-neutral-100 duration-300">{user.points}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
