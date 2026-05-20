import { Router } from "express";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createOrder, getOrderMonthlySales, getOrderSalesToday, getOrderSalesThisMonth, getOrderSalesThisWeek, getOrderSalesThisYear, getTotalOrders, getOrders } from "../controllers/orderController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.ORDER_CREATE),
    createOrder
)

router.get(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.ORDER_READ_ALL),
    getOrders
)

router.get(
    '/sales/monthly',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getOrderMonthlySales
)

router.get(
    '/sales/today',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getOrderSalesToday
)

router.get(
    '/sales/this-week',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getOrderSalesThisWeek
)

router.get(
    '/sales/this-month',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getOrderSalesThisMonth
)

router.get(
    '/sales/this-year',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getOrderSalesThisYear
)

router.get(
    '/total',
    authenticate,
    authorizePermission(PERMISSIONS.ORDER_CREATE),
    getTotalOrders
)

const orderRoutes = router;

export default orderRoutes;