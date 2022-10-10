import Button from "@general/button";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import { useState } from "react";

const LivePanel: NextPage = () => {
    const [inputs, setInput] = useState<{ [key: number]: string | number }>({});
    const { mutate: givePoints } = trpc.twitch.givePoints.useMutation();
    const { mutate: giveItem } = trpc.twitch.giveItem.useMutation();
    const { mutate: createCode } = trpc.code.create.useMutation();
    const { data: items } = trpc.item.get.useQuery();
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
                    <Button
                        type="primary"
                        className="mx-auto w-3/6"
                        onClick={() => {
                            givePoints({ points: (inputs[0] as number) || 0, user: null });
                            setInput({ 0: 0 });
                        }}
                    >
                        Give
                    </Button>
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
                    <Button
                        type="primary"
                        className="mx-auto mb-4 w-3/6"
                        onClick={() => {
                            givePoints({ points: (inputs[2] as number) || 0, user: inputs[1] as string });
                            setInput({ ...inputs, 1: "", 2: 0 });
                        }}
                    >
                        Give
                    </Button>
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
                    <Button
                        type="primary"
                        className="mx-auto mb-4 w-3/6"
                        onClick={() => {
                            console.log(inputs);
                            giveItem({ user: inputs[3] as string, itemId: inputs[4] as string });
                            setInput({ 3: "", 4: 0 });
                        }}
                    >
                        Give
                    </Button>
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
                    <Button
                        type="primary"
                        className="mx-auto mb-4 w-3/6"
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
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LivePanel;
