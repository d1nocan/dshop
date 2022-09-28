import Loading from "@general/loading";
import Buy from "@modals/BuyItem";
import CreateItem from "@modals/CreateItem";
import EditItem from "@modals/EditItem";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "src/utils/trpc";

const Store: NextPage = () => {
    const { data, error, isLoading } = trpc.useQuery(["item.get"]);
    const { data: session } = useSession();
    const router = useRouter();
    error?.data?.code === "UNAUTHORIZED" && router.push("/");
    if (isLoading) return <Loading />;
    return (
        <>
            {session?.user?.role === Role.Admin && <CreateItem />}
            <div className="container mx-auto mt-10 w-6/12 flex flex-row gap-4 justify-center flex-shrink-0 flex-wrap">
                {data
                    ?.filter((item) => item.isHidden === false)
                    .map((item, index) =>
                        session?.user?.role === Role.Admin ? (
                            <EditItem key={index} item={item} />
                        ) : (
                            <Buy key={index} item={item} />
                        ),
                    )}
                {data?.length === 0 && (
                    <div className="min-w-fit bg-violet-500 p-4 text-neutral-100 text-center rounded-xl mx-auto justify-center mt-10 shadow-lg">
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
