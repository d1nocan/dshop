import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateGiveawaySchema } from "@schemas/giveaway";

export const Giveaways = () => {
    const session = useSession();
    const { data: giveaways } = trpc.giveaway.get.useQuery();
    const { mutate } = trpc.giveaway.join.useMutation();
    const { mutate: createGiveaway } = trpc.giveaway.create.useMutation();
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(CreateGiveawaySchema),
        defaultValues: {
            endsAt: BigInt(10), // ????
            title: "",
            totalWinner: 1,
            points: 1,
        },
    });
    return (
        <>
            {session.data?.user?.role === "Admin" && (
                <div className="card mx-auto mt-10">
                    <form
                        className="card-body justify-around gap-2 text-center"
                        onSubmit={handleSubmit((data) =>
                            createGiveaway({ ...data, endsAt: BigInt(Date.now()) + data.endsAt * BigInt(100) }),
                        )}
                    >
                        <p>Title:</p>
                        <input type="text" className="input scale-95" {...register("title")} />
                        <p>Total winners:</p>
                        <input
                            type="number"
                            className="input mx-auto w-1/2 scale-95"
                            {...register("totalWinner", {
                                setValueAs: (x) => Number(x),
                            })}
                        />
                        <p>Points:</p>
                        <input
                            type="number"
                            className="input mx-auto w-1/2 scale-95"
                            {...register("points", {
                                setValueAs: (x) => Number(x),
                            })}
                        />
                        <p>Ends at (seconds):</p>
                        <input
                            type="number"
                            className="input mx-auto w-1/2 scale-95"
                            {...register("endsAt", {
                                setValueAs: (x) => BigInt(x),
                            })}
                        />
                        <button type="submit" className="button primary mt-4">
                            Create
                        </button>
                    </form>
                </div>
            )}
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
