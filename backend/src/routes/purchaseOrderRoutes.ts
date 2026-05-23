import { Router } from "express";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createPurchaseOrder, getPurchaseOrders, updatePurchaseOrder } from "../controllers/purchaseOrderController";

const router = Router();

router.get(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDER_READ_ALL),
    getPurchaseOrders
)

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDER_CREATE),
    createPurchaseOrder
)

router.patch(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.PURCHASE_ORDER_UPDATE),
    updatePurchaseOrder
)

const purchaseOrderRoutes = router;

export default purchaseOrderRoutes;