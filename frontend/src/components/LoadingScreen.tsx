import { Coffee } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-loading)] backdrop-blur-md z-50">

            <div className="flex flex-col items-center gap-4">

                {/* Logo */}
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--bg-panel)] shadow-lg animate-pulse">
                    <Coffee size={40} className="text-[var(--text-brown)]" />
                </div>

                {/* Brand Name */}
                <h1 className="text-lg font-semibold text-[var(--text-brown)] tracking-wide">
                    Banaag Coffee
                </h1>

                {/* Spinner */}
                <div className="w-6 h-6 border-2 border-[var(--text-brown)] border-t-transparent rounded-full animate-spin" />

                {/* Loading Text */}
                <p className="text-xs text-[var(--text-muted)]">
                    Brewing your experience...
                </p>

            </div>
        </div>
    );
}