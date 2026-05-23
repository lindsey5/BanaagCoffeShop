import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardLayout from "../pages/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PERMISSIONS } from "../config/permissions";
import Inventory from "../pages/Dashboard/Inventory";
import InventoryLayout from "../pages/InventoryLayout";
import Menu from "../pages/Dashboard/Menu";
import POS from "../pages/Dashboard/POS";
import Orders from "../pages/Dashboard/Orders";
import Roles from "../pages/Dashboard/Roles";
import Role from "../pages/Dashboard/Role";
import StockOutHistory from "../pages/Dashboard/StockOutHistory";
import Users from "../pages/Dashboard/Users";
import Suppliers from "../pages/Dashboard/Suppliers";
import PurchaseOrders from "../pages/Dashboard/PurchaseOrders";
import CreatePurchaseOrder from "../pages/Dashboard/CreatePurchaseOrder";
import StockInHistory from "../pages/Dashboard/StockInHistory";

const router = createBrowserRouter([
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/dashboard',
        Component: () => (
            <ProtectedRoute requireAuthentication>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.DASHBOARD_VIEW]}>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: 'inventory',
                Component: () => (
                    <ProtectedRoute anyPermissions={[PERMISSIONS.INVENTORY_READ_ALL, PERMISSIONS.STOCK_IN_READ_ALL, PERMISSIONS.STOCK_OUT_READ_ALL, PERMISSIONS.SUPPLIER_READ_ALL, PERMISSIONS.PURCHASE_ORDER_READ_ALL]}>
                        <InventoryLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.INVENTORY_READ_ALL]}>
                                <Inventory />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'stock-in',
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.STOCK_IN_READ_ALL]}>
                                <StockInHistory />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'stock-out',
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.STOCK_OUT_READ_ALL]}>
                                <StockOutHistory />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'suppliers',
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.SUPPLIER_READ_ALL]}>
                                <Suppliers />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'purchase-orders',
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.PURCHASE_ORDER_READ_ALL]}>
                                <PurchaseOrders />
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: 'menu',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.MENU_READ_ALL]}>
                        <Menu />
                    </ProtectedRoute>
                )
            },
            {
                path: 'POS',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.ORDER_CREATE]}>
                        <POS />
                    </ProtectedRoute>
                )
            },
            {
                path: 'orders',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.ORDER_READ_ALL]}>
                        <Orders />
                    </ProtectedRoute>
                )
            },
            {
                path: 'roles',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_READ_ALL]}>
                        <Roles />
                    </ProtectedRoute>
                )
            },
            {
                path: 'role/:id',
                Component: () => (
                    <ProtectedRoute anyPermissions={[PERMISSIONS.ROLE_READ_ALL, PERMISSIONS.ROLE_UPDATE]}>
                        <Role />
                    </ProtectedRoute>
                )
            },
            {
                path: 'create-role',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_CREATE]}>
                        <Role />
                    </ProtectedRoute>
                )
            },
            {
                path: 'users',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_READ_ALL]}>
                        <Users />
                    </ProtectedRoute>
                )
            },
            {
                path: 'purchase-order/create',
                Component: () => (
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.PURCHASE_ORDER_CREATE]}>
                        <CreatePurchaseOrder />
                    </ProtectedRoute>
                )
            }
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}