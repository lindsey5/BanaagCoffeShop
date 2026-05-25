import Card from "./Card";
import { formatLongDate, getTime } from "../../utils/dateUtils";
import { useAuthStore } from "../../lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const firstInitial = user?.firstname?.charAt(0) ?? "";
    const lastInitial = user?.lastname?.charAt(0) ?? "";

    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="z-30 fixed inset-x-0 top-0">
            <Card className="flex justify-between items-center rounded-none text-white">
                <h1 className="text-xl font-bold">
                    Banaag Kapehan
                </h1>

                <div className="flex gap-3 items-center">
                    <p>{formatLongDate(new Date())} | {time}</p>

                    <button 
                        className="border border-gray-400 cursor-pointer bg-panel text-brown p-1 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                        onClick={() => navigate('/dashboard/account')}
                    >
                        {firstInitial}
                        {lastInitial}
                    </button>
                </div>
            </Card>
        </header>
    );
}