import Card from "./Card";
import { formatLongDate } from "../../utils/dateUtils";
import { useAuthStore } from "../../lib/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const firstInitial = user?.firstname?.charAt(0) ?? "";
    const lastInitial = user?.lastname?.charAt(0) ?? "";

    return (
        <header className="z-30 fixed inset-x-0 top-0">
            <Card className="flex justify-between items-center rounded-none text-white">
                <h1 className="text-xl font-bold">
                    Banaag POS
                </h1>

                <div className="flex gap-3 items-center">
                    <p>{formatLongDate(new Date())}</p>

                    <button 
                        className="cursor-pointer bg-panel text-brown p-1 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                        onClick={() => navigate('/dashboard/profile')}
                    >
                        {firstInitial}
                        {lastInitial}
                    </button>
                </div>
            </Card>
        </header>
    );
}