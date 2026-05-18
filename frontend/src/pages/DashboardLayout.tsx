import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

export default function DashboardLayout () {
    return (
        <div className="min-h-screen bg-panel p-3">
            <div className="pl-65 pt-20 flex-1 gap-3">
                <Header />
                <Sidebar />
                <Outlet />
            </div>
        </div>
    )
}