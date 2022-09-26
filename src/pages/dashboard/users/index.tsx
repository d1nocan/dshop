import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { UserCard } from "@components/card";
import { trpc } from "@utils/trpc";

const Users: NextPage = () => {
  const { data: session } = useSession();
  const { data } = trpc.useQuery(["user.get"]);
  return (
    <>
      <div className="container flex flex-wrap justify-center gap-4 mx-auto px-6 py-10">
        {data?.map((user, index) => (
          <>
            <UserCard key={index} user={user} session={session} />
          </>
        ))}
        {data?.length === 0 && (
          <div className="alert alert-info w-40 mx-auto justify-center mt-10 shadow-lg">
            <div>
              <span>No user found</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
