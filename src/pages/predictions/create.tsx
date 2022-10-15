import { NextPage } from "next";
import { trpc } from "@utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPrediction, CreatePredictionInputType } from "@schemas/prediction";
import { X } from "phosphor-react";
import Loading from "@general/loading";
export const CreateVote: NextPage = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreatePredictionInputType>({
        resolver: zodResolver(createPrediction),
        defaultValues: {
            question: "",
            min: BigInt(0),
            max: BigInt(0),
            endsAt: new Date(Date.now() + 3600 * 1000 * 24),
            options: [{ text: "Yes" }, { text: "No" }],
        },
    });
    const { fields, append, remove } = useFieldArray<CreatePredictionInputType>({
        control,
        name: "options",
    });
    const { mutate, isLoading } = trpc.prediction.create.useMutation();
    console.log(errors);
    return (
        <div className="container mx-auto flex flex-col flex-wrap place-content-center justify-center gap-10 py-10">
            <div className="relative z-0 w-1/2">
                {isLoading ? (
                    <Loading />
                ) : (
                    <form
                        className="card-body relative flex-wrap justify-around gap-4 pb-6 text-center"
                        onSubmit={handleSubmit((data) => {
                            console.log(data);
                            mutate(data);
                        })}
                        style={{ maxHeight: "80vh" }}
                    >
                        <div className="mb-4 flex flex-col gap-4">
                            <label>
                                <span>Question</span>
                            </label>
                            <input {...register("question")} type="text" className="input" />
                            {errors.question && <p className="text-red-500">{errors.question.message}</p>}
                        </div>
                        <div className="mx-auto mb-4 flex w-full flex-col justify-around lg:flex-row">
                            <div className="flex flex-col gap-4">
                                <label>
                                    <span>Min bet</span>
                                </label>
                                <input
                                    {...register("min", { setValueAs: (x) => BigInt(x) })}
                                    type="number"
                                    className="input"
                                />
                                {errors.min && <p className="text-red-500">{errors.min.message}</p>}
                            </div>
                            <div className="flex flex-col gap-4">
                                <label>
                                    <span>Max bet</span>
                                </label>
                                <input
                                    {...register("max", { setValueAs: (x) => BigInt(x) })}
                                    type="number"
                                    className="input"
                                />
                                {errors.min && <p className="text-red-500">{errors.min.message}</p>}
                            </div>
                        </div>
                        <p className="-mt-2 font-light">If min equals false, then bet is disabled</p>
                        <div className="grid w-full grid-cols-1 gap-y-3 lg:grid-cols-2">
                            {fields.map((field, index) => (
                                <div key={field.id}>
                                    <section key={field.id}>
                                        <input
                                            placeholder={`Option #${index + 1}`}
                                            className="input"
                                            key={field.id}
                                            {...register(`options.${index}.text`)}
                                        />
                                        {fields.length > 2 && (
                                            <button
                                                title="Remove"
                                                type="button"
                                                className="ml-[-2em] rounded-r-xl border border-neutral-900 px-1 py-2 align-middle transition-colors duration-200 ease-in-out hover:border-opacity-90 hover:bg-neutral-50 dark:border-neutral-100 dark:border-opacity-40 dark:hover:border-opacity-20 dark:hover:bg-neutral-900"
                                                onClick={() => remove(index)}
                                            >
                                                <X size={22} weight="bold" className="text-violet-600" />
                                            </button>
                                        )}
                                    </section>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-row justify-center gap-4">
                            <button
                                type="button"
                                className="button"
                                value="Add more options"
                                onClick={() => append({ text: "Another Option" })}
                                disabled={fields.length >= 10}
                            >
                                Add options
                            </button>
                            <button type="submit" className="button success">
                                Create Question
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateVote;