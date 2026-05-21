import { Router } from "express";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createStockOut, getStockOutHistory } from "../controllers/stockOutController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.STOCK_OUT_CREATE),
    createStockOut
)

router.get(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.STOCK_OUT_REAL_ALL),
    getStockOutHistory
)

const stockOutRoutes = router;

export default stockOutRoutes;