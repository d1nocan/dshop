interface Props {
    type: "success" | "info" | "warning" | "error" | "primary" | "secondary" | "default";
    message?: string;
}

export function Alert({ type, message }: Props) {
    return (
        <div className={`alert ${type}`}>
            <h1 className="capitalize">{type}</h1>
            <p>{message}</p>
        </div>
    );
}

export default Alert;
