import type { NextPage } from "next";
import Ticket from "src/components/dashboard/ticket";
import { trpc } from "src/utils/trpc";

const Support: NextPage = () => {
  const tickets = trpc.useQuery(["ticket.get"]);
  return (
    <>
      <div className="container mx-auto w-full">
        {tickets.data?.length !== 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.data?.map((ticket, index) => (
                <Ticket
                  key={index}
                  image={ticket.user.image}
                  name={ticket.user.name}
                  title={ticket.title}
                  createdAt={ticket.createdAt}
                  status={ticket.status}
                />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="alert alert-info w-48 mx-auto justify mt-10 shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>No ticket found</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Support;
