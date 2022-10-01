import ItemCard from "@cards/ItemCard";
import Loading from "@general/loading";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { trpc } from "src/utils/trpc";

const CreateItem = dynamic(() => import("@modals/CreateItem"));

interface Props {
    isAdmin: boolean;
    isGuest: boolean;
}

const Store: NextPage<Props> = ({ isAdmin, isGuest }) => {
    const { data, isLoading, refetch } = trpc.useQuery(["item.get"]);
    if (isLoading) return <Loading />;
    return (
        <>
            {isAdmin && <CreateItem />}
            <div className="container mx-auto flex flex-wrap justify-center gap-4 py-10 px-6">
                {data
                    ?.filter((item) => item.isHidden === false)
                    .map((item, index) => (
                        <ItemCard key={index} refetch={refetch} item={item} isAdmin={isAdmin} isGuest={isGuest} />
                    ))}
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

Store.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const isAdmin = session?.user?.role === Role.Admin;
    const isGuest = !session?.user;
    return {
        isAdmin,
        isGuest,
    };
};

export default Store;
