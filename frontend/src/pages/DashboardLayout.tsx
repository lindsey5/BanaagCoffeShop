import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

export default function DashboardLayout () {
    return (
        <div className="relative min-h-screen flex flex-col bg-panel">
            <div className="z-10 h-full p-3 flex-1 flex flex-col gap-3">
                <Header />
                <div className="flex flex-1 gap-3">
                    <Sidebar />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}