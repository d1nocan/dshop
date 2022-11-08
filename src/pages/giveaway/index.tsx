import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";
import { buttonStyle } from "@styles/button";

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
                            <form key={giveaway.id} className="flex flex-col">
                                <button
                                    type="button"
                                    onClick={() => mutate({ id: giveaway.id })}
                                    className={buttonStyle() + " mx-auto w-fit"}
                                >
                                    Join
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {giveaway.endsAt <= Date.now() && (
                                    <>
                                        <p>This prediction is finished</p>
                                        {giveaway.winners !== null && (
                                            <p>Winner(s): {giveaway.winners.map((winner) => winner.name).join(", ")}</p>
                                        )}
                                    </>
                                )}
                                {giveaway.joined.some((joiner) => joiner.id === session.data?.user?.id) && (
                                    <p>You joined this giveaway</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {giveaways?.length === 0 && <p className="alert info w-fit">I couldn&apos;t find anything</p>}
        </>
    );
};

export default Giveaways;
