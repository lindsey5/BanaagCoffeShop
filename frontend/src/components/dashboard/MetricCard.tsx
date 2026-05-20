import { cn } from "../../utils/utils";
import Card from "../ui/Card";

interface MetricCardProps {
    title: string;
    content: string;
    onClick?: () => void;
}

export default function MetricCard({ title, content,onClick }: MetricCardProps) {
    return (
        <div onClick={onClick} className={cn(onClick && 'cursor-pointer')}>
            <Card className={cn(
                "p-3 md:p-5",
                onClick && 'hover:opacity-70'
            )}>
                <div className="flex flex-col gap-2">
                    <span className="text-sm md:text-md font-bold">{title}</span>
                    <h1 className="text-sm sm:text-lg lg:text-2xl">
                        {content}
                    </h1>
                </div>
            </Card>
        </div>
    );
}

export function MetricCardSkeleton() {
    return (
        <Card className="p-3 md:p-5">
            <div className="flex flex-col gap-5">
                <div className="w-full h-5 bg-loading animate-pulse"></div>
                <div className="w-full h-5 bg-loading animate-pulse"></div>
            </div>
        </Card>
    )
}