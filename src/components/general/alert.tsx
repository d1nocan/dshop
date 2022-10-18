import { Info } from "phosphor-react";

interface Props {
    type: "success" | "info" | "warning" | "error" | "primary" | "secondary" | "default";
    message?: string;
}

export function Alert({ type, message }: Props) {
    return (
        <div className={`alert ${type}`}>
            <div className="mb-1 flex gap-1">
                <Info size={22} className="my-auto text-neutral-50" />
                <h1 className="capitalize">{type}</h1>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Alert;
