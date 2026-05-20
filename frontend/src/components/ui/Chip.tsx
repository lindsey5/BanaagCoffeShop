import { cn } from "../../utils/utils";

type ChipProps = {
    label: string;
    variant?: "success" | "warning" | "danger" | "default";
    className?: string;
};

export default function Chip({
    label,
    variant = "default",
    className,
}: ChipProps) {
    const variants = {
        default: "bg-panel/80 text-brown",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                variants[variant],
                className
            )}
        >
            {label}
        </span>
    );
}