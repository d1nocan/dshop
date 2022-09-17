import Image from "next/image";
type Props = {
    image: string | null;
    name: string | null;
    title: string | null;
    createdAt: Date | null;
    status: string | null;
}

const Ticket = ({image, name, title, createdAt, status} : Props) => {
    return (<>
    <tr>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <Image src={image as string} alt={name as string} />
              </div>
            </div>
            <div>
              <div className="font-bold">{name}</div>
              <div className="text-sm opacity-50">{createdAt?.toLocaleString()}</div>
            </div>
          </div>
        </td>
        <td>
          {title}
        </td>
        <td>{status}</td>
        <th>
          <button type="button" className="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
    </>)
}


export default Ticket;