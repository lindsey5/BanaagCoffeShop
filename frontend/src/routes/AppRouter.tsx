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
                Component: () => <InventoryLayout />,
                children: [
                    {
                        index: true,
                        Component: () => (
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.INVENTORY_READ_ALL]}>
                                <Inventory />
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
            }
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}