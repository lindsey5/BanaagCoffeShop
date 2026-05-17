import { Router } from "express";
import { login, refreshAccessToken } from "../controllers/authController";
import { authenticate, authorizePermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createInventoryItem, deleteInventoryItem, getInventoryItems, updateInventoryItem } from "../controllers/inventoryItemController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.INVENTORY_CREATE),
    createInventoryItem
);

router.get(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.INVENTORY_READ_ALL),
    getInventoryItems
)

router.put(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.INVENTORY_UPDATE),
    updateInventoryItem
)

router.delete(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.INVENTORY_DELETE),
    deleteInventoryItem
)

const inventoryItemRoutes = router;

export default inventoryItemRoutes;