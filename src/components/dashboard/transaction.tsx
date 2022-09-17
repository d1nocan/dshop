import { useSession } from "next-auth/react";

type Props = {
  index: number;
  id: string | null;
  user: string | null;
  input: string | null;
  status: string | null;
  points: number;
};

const Transaction = ({ index, id, user, input, status, points }: Props) => {
  const session = useSession();
  return (
    <>
      <tr>
        <th>{index}</th>
        <td>{user}</td>
        <td>{id}</td>
        <td>{input}</td>
        <td>{points}</td>
        <td>{status}</td>
        {session.data?.user?.role === "ADMIN" && (
          <td>
            <button type="button" className="btn btn-ghost btn-xs">
              edit
            </button>
          </td>
        )}
      </tr>
    </>
  );
};

export default Transaction;
