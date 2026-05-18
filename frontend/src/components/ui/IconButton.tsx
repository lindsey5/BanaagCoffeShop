import { cn } from "../../utils/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
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
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e)
            }}
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