import type { ReactNode } from "react"
import { cn } from "../../utils/utils";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card ({ children, className} : CardProps) {
    return (
        <div className={cn(
            "border border-gray-500 shadow-lg rounded-lg p-5 bg-[url('https://i.pinimg.com/736x/d2/93/13/d29313da1e8b618ef31bc3c5d1fbf772.jpg')]",
            className
        )}>
            {children}
        </div>
    )
}