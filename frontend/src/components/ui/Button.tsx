import React from "react"
import { cn } from "../../utils/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {}

export default function Button({ className, onClick, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "bg-gradient-to-br from-[#8b5e3c] to-[#603F26] text-white px-3 py-3 text-md rounded-full transition flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
        >
        </button>
    )
}`  `