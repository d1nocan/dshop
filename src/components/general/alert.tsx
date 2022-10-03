interface Props {
    type: "success" | "info" | "warning" | "error";
    message?: string;
}

export function Alert({ type, message }: Props) {
    return (
        <div className={`${type}-alert`}>
            <h1 className="capitalize">{type}</h1>
            <p>{message}</p>
        </div>
    );
}

export default Alert;
