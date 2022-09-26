import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Ticket from "@components/dashboard/ticket";
import { trpc } from "@utils/trpc";

const Tickets: NextPage = () => {
  const { data: session } = useSession();
  const tickets = trpc.useQuery(["ticket.get"]);
  return (
    <>
      <div className="container mx-auto w-full">
        {session?.user?.role === Role.User && <button type="button" className="btn btn-primary mt-4 flex mx-auto">Create Ticket</button>}
        {tickets.data?.length !== 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Title</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.data?.map((ticket, index) => (
                <Ticket key={index} index={index} ticket={ticket} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info w-40 mx-auto justify-center mt-10 shadow-lg">
            <div>
              <span>No ticket found</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tickets;
