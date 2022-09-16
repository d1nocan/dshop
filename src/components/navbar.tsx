import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import dalle from "../../public/dalle.png";

export default function Navbar() {
  const { data: leaderboardData } = trpc.useQuery(["leaderboard.get"]);
  const { data: session } = useSession();
  return (
    <>
      <nav className="navbar">
        <div className="profile mt-6">
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
                  <p className="primary-text text-left">{session.user?.name}</p>
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
        <div className="nav">
          <div className="card p-6 gap-2">
            <Link href="/">
              <a className="primary-text">Main</a>
            </Link>
            <Link href="/dashboard/users">
              <a className="primary-text">Users</a>
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link href="/dashboard/items">
                <a className="primary-text">Items</a>
              </Link>
            )}
            <Link href="/store">
                <a className="primary-text">Store</a>
              </Link>
            <Link href="/dashboard/transactions">
              <a className="primary-text">Transactions</a>
            </Link>
          </div>
        </div>
        <div className="leaderboard overflow-auto">
          <p className="font-bold primary-text mb-4">Leaderboard</p>
          {leaderboardData?.map((user, index) => (
            <div key={index} className="flex flex-row justify-around my-2">
              <p className="secondary-text break-all w-1/3">{user.name}</p>
              <p className="secondary-text w-1/3">{user.points}</p>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
