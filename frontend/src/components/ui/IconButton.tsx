import { cn } from "../../utils/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    tooltip?: string;
    className?: string;
    disabled?: boolean;
    variant?: "default" | "danger";
};

export default function IconButton({
    icon,
    tooltip,
    onClick,
    className,
    disabled = false,
    variant = "default",
}: IconButtonProps) {

    const baseStyle =
        "relative flex items-center justify-center rounded-md transition w-9 h-9 cursor-pointer group";

    const variants = {
        default: "hover:bg-main/50 text-[var(--text-brown)]",
        danger: "hover:bg-red-500/20 text-red-500",
    };

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
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

            {tooltip && (
                <span
                    className="
                        absolute left-1/2 -translate-x-1/2 -bottom-10
                        whitespace-nowrap text-xs px-2 py-1
                        rounded bg-black text-white
                        opacity-0 group-hover:opacity-100
                        transition pointer-events-none
                    "
                >
                    {tooltip}
                </span>
            )}
        </button>
    );
}