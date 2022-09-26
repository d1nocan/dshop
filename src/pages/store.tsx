import { ItemCard } from "@components/card";
import type { NextPage } from "next";
import { trpc } from "src/utils/trpc";
import { signIn } from "next-auth/react";
import Loading from "@components/loading";

const Store: NextPage = () => {
    const { data, error, isLoading } = trpc.useQuery(["item.get"]);
    error?.data?.code === "UNAUTHORIZED" && signIn();
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="container mx-auto mt-10 w-6/12 flex flex-row gap-4 justify-center flex-shrink-0 flex-wrap">
                {data
                    ?.filter((item) => item.isHidden === false)
                    .map((item, index) => (
                        <ItemCard key={index} item={item} />
                    ))}
                {data?.length === 0 && (
                    <div className="alert alert-info w-40 mx-auto justify-center mt-10 shadow-lg">
                        <div>
                            <span>No item found</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Store;
