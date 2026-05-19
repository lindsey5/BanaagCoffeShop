import type { ReactNode } from "react";
import Card from "./Card";

export default function PageContainer ({ title, children, description } : { title: string, children: ReactNode, description: string }) {
    return (
        <div className="text-white flex flex-col gap-3 flex-1">
            <Card className="space-y-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm text-white/60">{description}</p>
            </Card>
            {children}
        </div>
    )
}