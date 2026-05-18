import { Router } from "express";
import { login, refreshAccessToken } from "../controllers/authController";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createInventoryItem, deleteInventoryItem, getInventoryItemById, getInventoryItems, updateInventoryItem } from "../controllers/inventoryItemController";

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

router.get(
    '/:id',
    authenticate,
    hasAnyPermission(PERMISSIONS.MENU_CREATE, PERMISSIONS.MENU_UPDATE),
    getInventoryItemById
)

const inventoryItemRoutes = router;

export default inventoryItemRoutes;