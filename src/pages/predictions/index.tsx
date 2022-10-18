import { makePrediction, makePredictionInputType } from "@schemas/prediction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { trpc } from "@utils/trpc";
import Link from "next/link";

export const PredictionPanel = () => {
    const session = useSession();
    const { data: predictions } = trpc.prediction.get.useQuery();
    const { register, handleSubmit, setValue } = useForm<makePredictionInputType>({
        resolver: zodResolver(makePrediction),
    });
    const { mutate } = trpc.prediction.make.useMutation();
    return (
        <>
            {session.data?.user?.role === "Admin" && (
                <Link href="/predictions/create">
                    <button type="button" className="button primary mx-auto mt-10 flex">
                        Create Prediction
                    </button>
                </Link>
            )}
            {predictions?.map((prediction) => (
                <div key={prediction.id} className="card mx-auto my-10">
                    <div className="card-body justify-evenly text-center">
                        <p className="text-xl font-bold">{prediction.question}</p>
                        {!prediction.Vote.some((vote) => vote.userId === session.data?.user?.id) &&
                        (prediction.endsAt as Date) >= new Date() ? (
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
                                {(prediction.endsAt as Date) <= new Date() && <p>This prediction is finished</p>}
                                {prediction.Vote.some((vote) => vote.userId === session.data?.user?.id) && (
                                    <p>
                                        Your selection:
                                        <br />
                                        {
                                            (prediction?.options as { text: string }[])?.[
                                                Number(
                                                    prediction.Vote.find(
                                                        (vote) => vote.userId === session.data?.user?.id,
                                                    )?.choice,
                                                )
                                            ]?.text
                                        }
                                    </p>
                                )}
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

export default PredictionPanel;
