import { Router } from "express";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createOrder } from "../controllers/orderController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.ORDER_CREATE),
    createOrder
)

const orderRoutes = router;

export default orderRoutes;