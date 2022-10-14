import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { env } from "src/env/client.mjs";
import { makePrediction, makePredictionInputType } from "@schemas/prediction";
import { zodResolver } from "@hookform/resolvers/zod";

const PredictionPanel = () => {
    const session = useSession();
    const { data: predictions } = trpc.prediction.get.useQuery();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<makePredictionInputType>({
        resolver: zodResolver(makePrediction),
    });
    const { mutate } = trpc.prediction.make.useMutation();
    console.log(errors);
    return (
        <>
            {predictions?.map((prediction) => (
                <div key={prediction.id} className="card mx-auto my-10">
                    <div className="card-body justify-evenly text-center">
                        <p className="text-xl font-bold">{prediction.question}</p>
                        {prediction.Vote.some((vote) => vote.userId === session.data?.user?.id) ? (
                            <p>
                                Your selection:
                                <br />
                                {
                                    (prediction?.options as { text: string }[])?.[
                                        Number(
                                            prediction.Vote.find((vote) => vote.userId === session.data?.user?.id)
                                                ?.choice,
                                        )
                                    ]?.text
                                }
                            </p>
                        ) : (prediction.endsAt as Date) >= new Date() ? (
                            <form
                                key={prediction.id}
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit((data) => mutate(data))}
                            >
                                {prediction.min !== prediction.max && (
                                    <>
                                        <p>{`Min bet: ${prediction.min} Max bet: ${prediction.max}`}</p>
                                        <input
                                            title="Your bet"
                                            type="number"
                                            min={Number(prediction.min)}
                                            max={Number(prediction.max)}
                                            className="input w-2/3"
                                            placeholder="Your bet"
                                            {...register("bet", {
                                                setValueAs: (x) => BigInt(x as number),
                                            })}
                                        />
                                    </>
                                )}
                                <select
                                    title="Select"
                                    className="input w-2/3"
                                    {...register("optionId", { setValueAs: (x) => Number(x) })}
                                >
                                    {(prediction.options as { text: string }[])?.map((option, index) => (
                                        <option key={index} value={index}>
                                            {option.text}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="button primary mx-auto w-2/3"
                                    onClick={() => setValue("predictionId", prediction.id)}
                                >
                                    Make choice
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p>This prediction is finished</p>
                                {prediction.winOption !== null && (
                                    <p>
                                        Winner: {(prediction.options as { text: string }[])[prediction.winOption]?.text}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

const Home: NextPage = () => {
    const session = useSession();
    return (
        <section>
            {session.status === "authenticated" ? (
                <PredictionPanel />
            ) : (
                <div className="my-64 mx-auto max-w-screen-xl px-4 lg:flex lg:h-96 lg:items-center">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="select-none bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                            {env.NEXT_PUBLIC_DEFAULT_SHOP_NAME}
                        </h1>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Home;
