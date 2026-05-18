import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardLayout from "../pages/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PERMISSIONS } from "../config/permissions";
import Inventory from "../pages/Dashboard/Inventory";
import InventoryLayout from "../pages/InventoryLayout";

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
                    <InventoryLayout />
                ),
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
            }
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}