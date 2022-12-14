import ItemCard from "@cards/ItemCard";
import Alert from "@general/alert";
import Loading from "@general/loading";
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
    const { data, isLoading, error, isError } = trpc.item.get.useQuery();
    if (isError) return <Alert message={error.message} type="error" />;
    if (isLoading) return <Loading />;
    return (
        <>
            {isAdmin && <CreateItem />}
            <div className="container mx-auto flex flex-wrap justify-center gap-6 py-10 px-6">
                {data?.map((item) => (
                    <ItemCard key={item.id} item={item} isAdmin={isAdmin} isGuest={isGuest} />
                ))}
                {data?.length === 0 && <Alert message="No items found" type="info" />}
            </div>
        </>
    );
};

Store.getInitialProps = async (ctx) => {
    const session = await getSession(ctx);
    const isAdmin = session?.user?.role === "Admin";
    const isGuest = !session?.user;
    return {
        isAdmin,
        isGuest,
    };
};

export default Store;
