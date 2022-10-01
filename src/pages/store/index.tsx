import dynamic from "next/dynamic";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "src/utils/trpc";

const Buy = dynamic(() => import("@modals/BuyItem"));
const EditItem  = dynamic(() => import("@modals/EditItem"));
const CreateItem = dynamic(() => import("@modals/CreateItem"));
const Loading = dynamic(() => import("@general/loading"));

const Store: NextPage = () => {
    const { data, isLoading } = trpc.useQuery(["item.get"]);
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === Role.Admin;
    const isGuest = !session?.user;
    if (isLoading) return <Loading />;
    return (
        <>
            {isAdmin && <CreateItem />}
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data
                    ?.filter((item) => item.isHidden === false)
                    .map((item, index) =>
                        session?.user?.role === Role.Admin ? (
                            <EditItem  key={index} item={item} />
                        ) : (
                            <Buy key={index} item={item} isGuest={isGuest}/>
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
