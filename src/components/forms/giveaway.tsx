import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateGiveawaySchema } from "@schemas/giveaway";
import { trpc } from "@utils/trpc";
import { inputStyle } from "@styles/input";
import { buttonStyle } from "@styles/button";

export const GiveawayForm = () => {
    const utils = trpc.useContext();
    const { mutate: createGiveaway } = trpc.giveaway.create.useMutation({
        onSuccess: () => {
            utils.giveaway.get.invalidate();
        },
    });
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
                    createGiveaway({ ...data, endsAt: BigInt(Date.now()) + data.endsAt * BigInt(1000) }),
                )}
            >
                <p>Title:</p>
                <input type="text" className={inputStyle({ size: "lg" })} {...register("title")} />
                <p>Total winners:</p>
                <input
                    type="number"
                    className={inputStyle({ size: "sm" })}
                    {...register("totalWinner", {
                        setValueAs: (x) => Number(x),
                    })}
                />
                <p>Points:</p>
                <input
                    type="number"
                    className={inputStyle({ size: "sm" })}
                    {...register("points", {
                        setValueAs: (x) => Number(x),
                    })}
                />
                <p>Ends at (seconds):</p>
                <input
                    type="number"
                    className={inputStyle({ size: "sm" })}
                    {...register("endsAt", {
                        setValueAs: (x) => BigInt(x),
                    })}
                />
                <button type="submit" className={buttonStyle() + " mx-auto my-4 flex w-fit justify-center"}>
                    Create
                </button>
            </form>
        </div>
    );
};

export default GiveawayForm;
