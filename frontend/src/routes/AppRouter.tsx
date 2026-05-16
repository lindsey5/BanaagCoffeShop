import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";

const router = createBrowserRouter([
    {
        index: true,
        Component: () => <Login />
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}