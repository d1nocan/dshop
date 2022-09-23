import Card from "../components/card";
import type { NextPage } from "next";
import { trpc } from "src/utils/trpc";
import { signIn } from "next-auth/react";

const Store: NextPage = () => {
  const {data, error} = trpc.useQuery(["item.get"]);
  error?.data?.code === "UNAUTHORIZED" && signIn();
  return (
    <>
      <div className="container mx-auto mt-10 w-6/12 flex flex-row gap-4 justify-center flex-shrink-0 flex-wrap">
        {data?.filter((item) => item.isHidden === false).map((item, index) =>
             (
                <Card
                  key={index}
                  {...item}
                />
            )
        )}
      </div>
    </>
  );
};

export default Store;
