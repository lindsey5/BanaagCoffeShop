import { NavLink, Outlet, useLocation } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import { WhiteCard } from "../components/ui/Card";
import { Package, MinusCircle, Truck, ClipboardList, PlusCircle } from "lucide-react";
import { PERMISSIONS } from "../config/permissions";
import usePermissions from "../hooks/usePermissions";

const menu = [
    { label: "Inventory", path: "/dashboard/inventory", icon: <Package size={16} />, permission: PERMISSIONS.INVENTORY_READ_ALL },
    { label: "Stock In", path: "/dashboard/inventory/stock-in", icon: <PlusCircle size={16} />, permission: PERMISSIONS.STOCK_IN_READ_ALL },
    { label: "Stock out", path: "/dashboard/inventory/stock-out", icon: <MinusCircle size={16} />, permission: PERMISSIONS.STOCK_OUT_REAL_ALL },
    { label: "Suppliers", path: "/dashboard/inventory/suppliers", icon: <Truck size={16} />, permission: PERMISSIONS.SUPPLIER_READ_ALL },
    { label: "Purchase Orders", path: "/dashboard/inventory/purchase-orders", icon: <ClipboardList size={16} />, permission: PERMISSIONS.PURCHASE_ORDER_READ_ALL },
];

export default function InventoryLayout() {
    const location = useLocation();
    const { hasPermissions } = usePermissions();

    const filteredMenu = menu.filter(item => hasPermissions([item.permission]));

    return (
        <PageContainer
            title="Inventory"
            description="Manage your coffee shop inventory, suppliers, and purchase orders"
        >
            <WhiteCard className="space-y-5">
                <div className="flex overflow-x-auto gap-2 pb-3 border-b">
                    {filteredMenu.map((item) => {
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