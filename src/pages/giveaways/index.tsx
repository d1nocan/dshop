import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";

const GiveawayForm = dynamic(() => import("@forms/giveaway"));

export const Giveaways = () => {
    const session = useSession();
    const { data: giveaways } = trpc.giveaway.get.useQuery();
    const { mutate } = trpc.giveaway.join.useMutation();
    return (
        <>
            {session.data?.user?.role === "Admin" && <GiveawayForm />}
            {giveaways?.map((giveaway) => (
                <div key={giveaway.id} className="card mx-auto my-10">
                    <div className="card-body justify-evenly text-center">
                        <p className="text-xl font-bold">{giveaway.title}</p>
                        {!giveaway.joined.some((joiner) => joiner.id === session.data?.user?.id) &&
                        giveaway.endsAt >= Date.now() ? (
                            <form
                                key={giveaway.id}
                                className="flex flex-col gap-4"
                                onSubmit={() => mutate({ id: giveaway.id })}
                            >
                                <button type="submit" className="button primary mx-auto w-2/3">
                                    Join
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {giveaway.endsAt <= Date.now() && <p>This prediction is finished</p>}
                                {giveaway.joined.some((joiner) => joiner.id === session.data?.user?.id) && (
                                    <p>You joined this giveaway</p>
                                )}
                                {giveaway.winners !== null && (
                                    <p>Winners: {giveaway.winners.map((winner) => winner.name).join(", ")}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default Giveaways;
