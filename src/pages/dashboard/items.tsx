import type { NextPage } from "next";
import { useState } from "react";
import Card from "src/components/card";
import { CreateModal } from "src/components/modal";
import { trpc } from "src/utils/trpc";

const Items: NextPage = () => {
  const [showModal, setShowModal] = useState(false);
    const { data } = trpc.useQuery(["item.get"]);
    return (<>
    {showModal && <div className="ease-in-out"><CreateModal setShowModal={setShowModal} /></div>}
    <button type="button" onClick={() => setShowModal(true)} className="btn btn-primary flex mx-auto w-36 mt-10">
                Create Item
    </button>
    <div className="flex flex-row py-10 gap-4 justify-center flex-shrink-0 flex-wrap">
        {data?.map((item, index) => (
            <Card
            key={index}
              {...item}
            />
        ))}
      </div>
    </>)
}

export default Items;