import { Router } from "express";
import { getMonthlyExpensesByYear, getStockInHistory } from "../controllers/stockInController";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";

const router = Router();

router.get(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.STOCK_IN_READ_ALL),
    getStockInHistory
)

router.get(
    '/monthly-expenses',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getMonthlyExpensesByYear
)

const stockInRoutes = router;

export default stockInRoutes;