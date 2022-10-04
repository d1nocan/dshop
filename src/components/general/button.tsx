interface Props {
    type: "success" | "warning" | "danger" | "primary" | "secondary";
    outline?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const Button = ({ type, outline, children, onClick, className, disabled }: Props) => {
    return (
        <button
            type="button"
            className={`button ${outline ? "outline" : ""} ${type} ${className ? className : ""}`.replace("  ", " ")}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
