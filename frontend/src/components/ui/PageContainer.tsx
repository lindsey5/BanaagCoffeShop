import type { ReactNode } from "react";
import Card from "./Card";

export default function PageContainer ({ title, children } : { title: string, children: ReactNode }) {
    return (
        <div className="text-white flex flex-col gap-3 flex-1">
            <Card className="space-y-2">
                <h1 className="text-2xl font-bold">{title}</h1>
            </Card>
            <Card>
               {children}
            </Card>
        </div>
    )
}