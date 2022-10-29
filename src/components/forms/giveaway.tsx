import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateGiveawaySchema } from "@schemas/giveaway";
import { trpc } from "@utils/trpc";

export const GiveawayForm = () => {
    const { mutate: createGiveaway } = trpc.giveaway.create.useMutation();
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(CreateGiveawaySchema),
        defaultValues: {
            endsAt: BigInt(10),
            title: "",
            totalWinner: 1,
            points: 1,
        },
    });
    return (
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
    );
};

export default GiveawayForm;
