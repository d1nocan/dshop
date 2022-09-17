import type { NextPage } from "next";
import Card from "src/components/card";
import { trpc } from "src/utils/trpc";

const Items: NextPage = () => {
    const items = trpc.useQuery(["item.get"]);
    return (<>
    <div className="flex flex-row py-10 gap-4 justify-center flex-shrink-0 flex-wrap">
        {items.data?.map((item, index) => (
            <Card
              key={index}
              description={item.description as string}
              title={item.name}
              price={item.price}
              isHidden={item.isHidden}
            />
        ))}
      </div>
    </>)
}

export default Items;