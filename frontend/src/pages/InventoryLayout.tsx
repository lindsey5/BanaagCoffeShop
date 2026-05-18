import { NavLink, Outlet, useLocation } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import { WhiteCard } from "../components/ui/Card";
import { Package, MinusCircle, Truck, ClipboardList, PlusCircle } from "lucide-react";

const menu = [
    { label: "Inventory", path: "/dashboard/inventory", icon: <Package size={16} /> },
    { label: "Stock In", path: "/dashboard/inventory/stock-in", icon: <PlusCircle size={16} /> },
    { label: "Stock out", path: "/dashboard/inventory/stock-out", icon: <MinusCircle size={16} /> },
    { label: "Suppliers", path: "/dashboard/inventory/suppliers", icon: <Truck size={16} /> },
    { label: "Purchase Orders", path: "/dashboard/inventory/purchase-orders", icon: <ClipboardList size={16} /> },
];

export default function InventoryLayout() {
    const location = useLocation();

    return (
        <PageContainer
            title="Inventory"
            description="Manage your coffee shop inventory, suppliers, and purchase orders"
        >
            <WhiteCard className="space-y-5">
                <div className="flex overflow-x-auto gap-2 pb-3 border-b">
                    {menu.map((item) => {
                        const active = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`min-w-30 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    active
                                        ? "bg-main text-white"
                                        : "hover:bg-main/50"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>
                <Outlet />
            </WhiteCard>
        </PageContainer>
    );
}