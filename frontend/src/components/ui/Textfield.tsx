import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    label?: string;
    registration?: any;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
};

export default function TextField({
    type = "text",
    className,
    placeholder,
    label,
    disabled,
    error,
    registration,
    icon,
    iconPosition = "left",
    onChange,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // run react-hook-form onChange if exists
        if (registration?.onChange) registration.onChange(e);

        // run custom onChange if exists
        if (onChange) onChange(e);
    };

    return (
        <div className={cn("w-full flex flex-col gap-1 text-black", className)}>
            {label && (
                <label className="text-xs font-medium text-muted">
                {label}
                </label>
            )}
            <div className={"relative w-full bg-white rounded-md"}>
                <input
                {...registration}
                {...props}
                disabled={disabled}
                type={inputType}
                placeholder={placeholder}
                onChange={handleChange}
                className={cn(
                    "w-full p-3 pr-12  border text-xs rounded-md outline-none transition-all",
                    icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
                    error
                    ? "border-red-500"
                    : "border-gray-400",
                )}
                />

                {icon && iconPosition === "left" && (
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                )}

                {type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                )}

                {icon && iconPosition === "right" && (
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                )}
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}