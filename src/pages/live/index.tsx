import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import { useEffect, useState } from "react";

type choice = {
    text: string;
};

const LivePanel: NextPage = () => {
    const [inputs, setInput] = useState<{ [key: number]: string | number }>({});
    const { mutate: givePoints } = trpc.twitch.givePoints.useMutation();
    const { mutate: giveItem } = trpc.twitch.giveItem.useMutation();
    const { mutate: createCode } = trpc.code.create.useMutation();
    const { data: items } = trpc.item.get.useQuery();
    const { data: predictions } = trpc.prediction.get.useQuery();
    const { mutate: closePrediction } = trpc.prediction.close.useMutation();
    const { mutate: setWinner } = trpc.prediction.winners.useMutation();
    const { data: user, isLoading, mutate: getUser } = trpc.twitch.selectRandom.useMutation();
    useEffect(() => {
        if (!isLoading) {
            setInput({ ...inputs, 8: user as string });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    return (
        <div className="container mx-auto flex flex-wrap justify-center gap-6 py-10 px-6">
            <div className="card">
                <div className="card-body relative justify-between gap-4 py-10 text-center">
                    <h1 className="text-xl font-bold">Give points everyone</h1>
                    <div className="input-area">
                        <p>Points</p>
                        <input
                            className="input w-2/3"
                            type="number"
                            title="Points"
                            value={inputs[0]}
                            onChange={(e) => setInput({ ...inputs, 0: Number(e.target.value) })}
                        />
                    </div>
                    <button
                        type="button"
                        className="button primary mx-auto w-3/6"
                        onClick={() => {
                            givePoints({ points: (inputs[0] as number) || 0, user: null });
                            setInput({ ...inputs, 0: 0 });
                        }}
                    >
                        Give
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="card-body relative justify-between py-6 text-center">
                    <h1 className="text-xl font-bold">Give points</h1>
                    <div className="input-area">
                        <p>User</p>
                        <input
                            className="input w-2/3"
                            title="User"
                            value={inputs[1]}
                            onChange={(e) => setInput({ ...inputs, 1: e.target.value })}
                        />
                        <p>Points</p>
                        <input
                            className="input w-2/3"
                            type="number"
                            title="Points"
                            value={inputs[2]}
                            onChange={(e) => setInput({ ...inputs, 2: Number(e.target.value) })}
                        />
                    </div>
                    <button
                        type="button"
                        className="button primary mx-auto mb-4 w-3/6"
                        onClick={() => {
                            givePoints({ points: (inputs[2] as number) || 0, user: inputs[1] as string });
                            setInput({ ...inputs, 1: "", 2: 0 });
                        }}
                    >
                        Give
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="card-body relative justify-between gap-4 py-6 text-center">
                    <h1 className="text-xl font-bold">Give Item</h1>
                    <div className="input-area">
                        <p>User</p>
                        <input
                            className="input w-2/3"
                            title="User"
                            value={inputs[3]}
                            onChange={(e) => setInput({ 3: e.target.value })}
                        />
                        <p>Item</p>
                        <select
                            name="Test"
                            title="test"
                            className="input w-2/3"
                            onChange={(e) => setInput({ 3: inputs[3] as string, 4: e.currentTarget.value })}
                        >
                            {items?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        className="button primary mx-auto mb-4 w-3/6"
                        onClick={() => {
                            console.log(inputs);
                            giveItem({ user: inputs[3] as string, itemId: inputs[4] as string });
                            setInput({ ...inputs, 3: "", 4: 0 });
                        }}
                    >
                        Give
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="card-body relative justify-between gap-4 py-6 text-center">
                    <h1 className="text-xl font-bold">Create Code</h1>
                    <div className="input-area">
                        <p>Code</p>
                        <input
                            className="input w-2/3"
                            title="Code"
                            value={inputs[5]}
                            onChange={(e) => setInput({ ...inputs, 5: e.target.value })}
                        />
                        <p>Points</p>
                        <input
                            className="input w-2/3"
                            title="Points"
                            type="number"
                            value={inputs[6]}
                            onChange={(e) => setInput({ ...inputs, 6: e.target.value })}
                        />
                        <p>Limit</p>
                        <input
                            className="input w-2/3"
                            title="Limit"
                            value={inputs[7]}
                            onChange={(e) => setInput({ ...inputs, 7: e.target.value })}
                        />
                    </div>
                    <button
                        type="button"
                        className="button primary mx-auto mb-4 w-3/6"
                        onClick={() => {
                            console.log(inputs);
                            createCode({
                                code: inputs[5] as string,
                                points: BigInt(inputs[6] as number),
                                limit: Number(inputs[7]),
                            });
                            setInput({ ...inputs, 5: "", 6: 0, 7: 0 });
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="card-body relative justify-evenly gap-10 py-6 text-center">
                    <h1 className="text-xl font-bold">Select Random</h1>
                    <p className="text-lg font-semibold">{inputs[8]}</p>
                    <button
                        type="button"
                        className="button primary mx-auto mb-4 w-3/6"
                        onClick={() => {
                            getUser();
                        }}
                    >
                        Select
                    </button>
                </div>
            </div>
            {predictions?.map((prediction) => (
                <div key={prediction.id} className="h-full w-5/6">
                    <div className="card-body relative justify-around py-10 text-center">
                        <h1 className="text-2xl font-bold">{prediction.question}</h1>
                        <p>Total points: {Number(prediction.total)}</p>
                        <p>Total bets: {prediction.Vote.length}</p>
                        {(prediction.endsAt as Date) >= new Date() && (
                            <button
                                type="button"
                                className="button danger mx-auto w-24"
                                onClick={() => closePrediction({ id: prediction.id })}
                            >
                                Close
                            </button>
                        )}
                        {prediction.winOption === null && (
                            <>
                                <p>Select Winner:</p>
                                <select
                                    title="Select"
                                    className="input mx-auto my-1 w-1/6"
                                    value={inputs[9]}
                                    onChange={(e) => setInput({ ...inputs, 9: Number(e.target.value) })}
                                >
                                    {(prediction.options as choice[]).map((option, index) => (
                                        <option key={index} value={index}>
                                            {option.text}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="button success mx-auto my-4 w-[10%] outline"
                                    onClick={() => setWinner({ id: prediction.id, option: inputs[9] as number })}
                                >
                                    Set Winner
                                </button>
                            </>
                        )}
                        <div className="flex flex-row flex-wrap gap-x-2 gap-y-5">
                            {(prediction.options as choice[])?.map((option, index) => {
                                const percentage = (
                                    (prediction.Vote.filter((vote) => vote.choice === index).length /
                                        prediction.Vote.length) *
                                    100
                                ).toFixed();
                                return (
                                    <div
                                        key={index}
                                        className={`relative mx-auto flex w-3/12 flex-col gap-2 rounded-lg ${
                                            prediction.winOption === index
                                                ? "border-4 border-violet-500"
                                                : "border border-neutral-500 border-opacity-30"
                                        }  py-4`}
                                    >
                                        <div className="mx-auto flex flex-col text-center">
                                            <span className="text-lg font-semibold capitalize">{option?.text}</span>
                                        </div>
                                        <div className="mx-auto h-3 w-2/3 rounded-full bg-gray-50 dark:bg-neutral-700">
                                            <div
                                                className={`h-3 rounded-full bg-violet-600`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <p>{percentage}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
            ;
        </div>
    );
};

export default LivePanel;
