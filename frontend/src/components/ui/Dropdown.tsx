import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/utils"

type Option = {
    label: string
    value: string
}

type DropdownProps = {
    label?: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    error?: string
    className?: string
}

export default function Dropdown({
    label,
    options,
    value,
    onChange,
    className,
    error
}: DropdownProps) {
    const [open, setOpen] = useState(false)

    const selected = options.find(o => o.value === value)

    return (
        <div className={cn(
            "flex flex-col space-y-1 text-black text-xs",
            className
        )}>
            {/* Label */}
            {label && (
                <span className="text-muted px-1">
                    {label}
                </span>
            )}

            <div className="relative h-full">
                {/* Button */}
                <button
                    type="button"
                    onClick={() => setOpen(prev => !prev)}
                    className={cn(
                        "w-full h-full flex items-center justify-between px-3 py-3 bg-white border border-gray-400 rounded-sm",
                        error && "border-red-500"
                    )}
                >
                    <span className={cn(
                        !value && 'text-muted'
                    )}>{selected?.label || "Select"}</span>
                    <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="overflow-y-auto absolute mt-2 w-full bg-white border border-gray-400 rounded-sm z-10">
                        {options.map(option => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setOpen(false)
                                }}
                                className={cn(
                                    "px-4 py-2 cursor-pointer transition hover:bg-hover",
                                    value === option.value && 'text-brown bg-hover'
                                )}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}