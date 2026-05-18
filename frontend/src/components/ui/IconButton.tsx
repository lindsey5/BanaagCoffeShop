import { cn } from "../../utils/utils";

type IconButtonProps = {
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: "default" | "danger";
};

export default function IconButton({
    icon,
    onClick,
    className,
    disabled = false,
    variant = "default",
}: IconButtonProps) {

    const baseStyle =
        "flex items-center justify-center rounded-md transition w-9 h-9 cursor-pointer";

    const variants = {
        default: "hover:bg-main/50 text-[var(--text-brown)]",
        danger: "hover:bg-red-500/20 text-red-500",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                baseStyle,
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {icon}
        </button>
    );
}