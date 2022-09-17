import Card from "../components/card";
import type { NextPage } from "next";
import { trpc } from "src/utils/trpc";

const Store: NextPage = () => {
  const items = trpc.useQuery(["item.get"]);
  return (
    <>
      <div className="container mx-auto mt-10 w-6/12 flex flex-row gap-4 justify-center flex-shrink-0 flex-wrap">
        {items.data?.filter((item) => item.isHidden === false).map((item, index) =>
             (
                <Card
                  key={index}
                  description={item.description as string}
                  title={item.name}
                  price={item.price}
                />
            )
        )}
      </div>
    </>
  );
};

export default Store;
