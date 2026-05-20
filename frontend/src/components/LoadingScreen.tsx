
export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-panel backdrop-blur-md z-50">

            <div className="flex flex-col items-center gap-4">

                {/* Logo */}
                <div className="w-30 h-30 p-2 flex items-center justify-center rounded-full bg-[var(--bg-panel)] shadow-lg overflow-hidden">
                    <img
                        src="/logo.jpg"
                        alt="Banaag Coffee Logo"
                        className="w-full h-full object-cover rounded-full"
                    />
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