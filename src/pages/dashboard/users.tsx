import type { NextPage } from "next";
import User from "src/components/dashboard/user";

import { trpc } from "src/utils/trpc";

const Users: NextPage = () => {
  const users = trpc.useQuery(["user.get"]);
  return (
    <>
      <div className="container mx-auto px-6 py-10">
        <div className="sm:shadow rounded">
          {users?.data?.map((user, index) => (
            <>
              <User
                key={index}
                image={user.image}
                name={user.name}
                points={user.points}
                role={user.role}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Users;
