import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

export default function DashboardLayout () {
    return (
        <div className="relative h-screen flex flex-col">
            <video autoPlay muted loop
                className="absolute w-full h-full object-cover z-0"
            >
                <source src="/coffee-bg.mp4" type="video/mp4"/>
            </video>
            <div className="z-10 h-full p-3 flex flex-col gap-3">
                <Header />
                <div className="flex flex-1 gap-3">
                    <Sidebar />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}