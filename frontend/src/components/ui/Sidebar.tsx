import { Archive, LayoutDashboard, Coffee, ClipboardList, LogOut, Shield, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PointOfSale } from "@mui/icons-material";
import Card from "./Card";
import { useAuthStore } from "../../lib/store/authStore";

const items = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/dashboard/inventory", label: "Inventory", icon: <Archive size={18} /> },
    { path: "/dashboard/menu", label: "Menu", icon: <Coffee size={18} /> },
    { path: "/dashboard/pos", label: "POS", icon: <PointOfSale sx={{ width: 18, height: 18 }} /> },
    { path: "/dashboard/orders", label: "Orders", icon: <ClipboardList size={18} /> },
    { path: '/dashboard/roles', label: "Roles", icon: <Shield size={18}/>},
    { path: '/dashboard/users', label: 'Users', icon: <User size={18}/>}
];

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    return (
        <aside className="text-white w-60 fixed left-3 bottom-5 top-23">
            <Card className="flex flex-col justify-between h-full w-full">
                <div className="space-y-5">
                    <div className="flex flex-col leading-tight">
                        <h1 className="text-sm font-semibold text-white">
                            {user?.firstname} {user?.lastname}
                        </h1>

                        <h3 className="text-xs text-white/60 capitalize">
                            {user?.role}
                        </h3>
                    </div>

                    {/* NAV ITEMS */}
                    <nav className="flex flex-col gap-3">
                        {items.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                                        active ? "bg-white/20" : "hover:bg-white/10"
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </Card>
        </aside>
    );
}