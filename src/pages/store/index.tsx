import dynamic from "next/dynamic";
import Loading from "@general/loading";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "src/utils/trpc";

const DynamicBuy = dynamic(() => import("@modals/BuyItem"));

const DynamicEditItem = dynamic(() => import("@modals/EditItem"));

const DynamicCreateItem = dynamic(() => import("@modals/CreateItem"));

const Store: NextPage = () => {
    const { data, error, isLoading } = trpc.useQuery(["item.get"]);
    const { data: session } = useSession();
    const router = useRouter();
    error?.data?.code === "UNAUTHORIZED" && router.push("/");
    if (isLoading) return <Loading />;
    return (
        <>
            {session?.user?.role === Role.Admin && <DynamicCreateItem />}
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data
                    ?.filter((item) => item.isHidden === false)
                    .map((item, index) =>
                        session?.user?.role === Role.Admin ? (
                            <DynamicEditItem key={index} item={item} />
                        ) : (
                            <DynamicBuy key={index} item={item} />
                        ),
                    )}
                {data?.length === 0 && (
                    <div className="mx-auto mt-10 min-w-fit justify-center rounded-xl bg-violet-500 p-4 text-center text-neutral-100 shadow-lg">
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
