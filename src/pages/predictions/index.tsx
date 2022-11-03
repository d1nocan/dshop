import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"));
const JoinPrediction = dynamic(() => import("@forms/prediction"));

export const PredictionPanel = () => {
    const session = useSession();
    const { data: predictions } = trpc.prediction.get.useQuery();
    return (
        <>
            {session.data?.user?.role === "Admin" && (
                <Link href="/predictions/create">
                    <button type="button" className="button primary mx-auto mt-10 flex">
                        Create Prediction
                    </button>
                </Link>
            )}
            <div className="container mx-auto my-10 flex flex-wrap justify-center gap-4 px-6">
                {predictions?.map((prediction) => (
                    <div key={prediction.id} className="card">
                        <div className="card-body justify-evenly text-center">
                            <p className="text-xl font-bold">{prediction.question}</p>
                            {!prediction.Vote.some((vote) => vote.userId === session.data?.user?.id) &&
                            (prediction.endsAt as Date) >= new Date() ? (
                                <JoinPrediction prediction={prediction} />
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
                                            Winner:{" "}
                                            {(prediction.options as { text: string }[])[prediction.winOption]?.text}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PredictionPanel;
