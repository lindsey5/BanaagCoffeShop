import type React from "react";
import { Menu } from "lucide-react";
import { cn } from "../../utils/utils";
import { WhiteCard } from "./Card";
import { useEffect, useRef, useState } from "react";

interface FiltersMenuProps {
    children: React.ReactNode;
    className?: string;
    containerStyle?: string;
}

export default function FiltersMenu({
    children,
    className,
    containerStyle
}: FiltersMenuProps) {
    const [show, setShow] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className={cn("relative", className)}>
            <button
                className="p-2 rounded-md"
                onClick={() => setShow((prev) => !prev)}
            >
                <Menu size={20} className={cn(show && "text-brown")} />
            </button>

            <WhiteCard
                className={cn(
                "absolute right-0 mt-2 w-56 z-10 transition-all duration-300 ease-in",
                show ? "opacity-100 visible" : "opacity-0 invisible",
                containerStyle
                )}
            >
                {children}
            </WhiteCard>
        </div>
    );
}