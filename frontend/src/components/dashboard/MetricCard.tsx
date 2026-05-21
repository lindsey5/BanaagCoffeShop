import type { ReactNode } from "react";
import { cn } from "../../utils/utils";
import { WhiteCard } from "../ui/Card";

interface MetricCardProps {
    title: string;
    content: string;
    icon?: ReactNode;
    onClick?: () => void;
}

export default function MetricCard({
    title,
    content,
    icon,
    onClick
}: MetricCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(onClick && "cursor-pointer")}
        >
            <WhiteCard
                className={cn(
                    "p-3 md:p-5 transition",
                    onClick && "hover:opacity-70"
                )}
            >
                <div className="flex items-center justify-between gap-3">
                    
                    <div className="flex flex-col gap-2">
                        <span className="text-sm md:text-md font-bold text-brown">
                            {title}
                        </span>

                        <h1 className="text-sm sm:text-lg lg:text-2xl text-brown">
                            {content}
                        </h1>
                    </div>

                    {icon && (
                        <div className="rounded-full p-3 bg-brown text-white">
                            {icon}
                        </div>
                    )}
                </div>
            </WhiteCard>
        </div>
    );
}

export function MetricCardSkeleton() {
    return (
        <WhiteCard className="p-3 md:p-5">
            <div className="flex items-center justify-between gap-5">
                
                <div className="flex flex-col gap-5 flex-1">
                    <div className="w-full h-5 bg-loading animate-pulse rounded-md"></div>
                    <div className="w-3/4 h-5 bg-loading animate-pulse rounded-md"></div>
                </div>

                <div className="w-10 h-10 rounded-full bg-loading animate-pulse"></div>
            </div>
        </WhiteCard>
    );
}