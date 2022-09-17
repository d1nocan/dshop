import type { NextPage } from "next";
import Image from "next/image";

import { trpc } from "src/utils/trpc";

const Users: NextPage = () => {
  const users = trpc.useQuery(["user.get"]);
  return (
    <>
      <div className="container flex flex-wrap justify-center gap-4 mx-auto px-6 py-10">
          {users?.data?.map((user, index) => (
            <>
              <div key={index} className="card w-72 bg-base-100 shadow-xl">
                <figure className="p-12 mt-4 relative mx-auto">
                  <Image
                    src={user.image as string}
                    alt={user.name as string}
                    layout="fill"
                    className="rounded-xl"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{user.name}</h2>
                  <p>Points: {user.points}</p>
                  <p className="">Role: {user.role.toLowerCase()}</p>
                  <div className="card-actions">
                    <button type="button" className="btn btn-primary">Details</button>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
    </>
  );
};

export default Users;
