import React from "react";
import { WhiteCard } from "./ui/Card";
import { Lock } from "lucide-react";

export default function Unauthorized({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background (blurred content) */}
            <div className="pointer-events-none select-none blur-md">
                {children}
            </div>

            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            {/* Center modal */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <WhiteCard className="p-10 flex flex-col items-center gap-4 shadow-xl">
                    <Lock size={60} />

                    <h1 className="text-xl font-bold text-primary">
                        Access Restricted
                    </h1>

                    <p className="text-brown/80 text-center max-w-xs">
                        You don’t have permission to view this content.
                    </p>
                </WhiteCard>
            </div>
        </div>
    );
}