import { makePrediction, type makePredictionInputType } from "@schemas/prediction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "@utils/trpc";
import type { Prediction, Vote } from "@prisma/client";

interface Props {
    prediction: Prediction & {
        Vote: Vote[];
    };
}

export const JoinPrediction = ({ prediction }: Props) => {
    const utils = trpc.useContext();
    const { register, handleSubmit, setValue } = useForm<makePredictionInputType>({
        resolver: zodResolver(makePrediction),
    });
    const { mutate } = trpc.prediction.make.useMutation({
        onSuccess: () => {
            toast("Prediction Made!", {
                icon: "👍",
                position: "bottom-center",
                className: "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-800",
            });
            utils.prediction.get.invalidate();
        },
    });
    return (
        <form key={prediction.id} className="flex flex-col gap-4" onSubmit={handleSubmit((data) => mutate(data))}>
            {prediction.min !== prediction.max && (
                <>
                    <p>{`Min bet: ${prediction.min} Max bet: ${prediction.max}`}</p>
                    <input
                        title="Your bet"
                        type="number"
                        min={Number(prediction.min)}
                        max={Number(prediction.max)}
                        defaultValue={Number(prediction.min)}
                        className="input w-2/3"
                        placeholder="Your bet"
                        {...register("bet", {
                            setValueAs: (x) => BigInt(x as number),
                        })}
                    />
                </>
            )}
            <select title="Select" className="input w-2/3" {...register("optionId", { setValueAs: (x) => Number(x) })}>
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
    );
};

export default JoinPrediction;
