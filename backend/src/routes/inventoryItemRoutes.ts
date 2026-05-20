import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createInventoryItem, deleteInventoryItem, getInventoryItemById, getInventoryItems, getTotalInventoryItems, getTotalLowStockInventoryItems, updateInventoryItem } from "../controllers/inventoryItemController";

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

router.get(
    '/low-stock',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getTotalLowStockInventoryItems
)

router.get(
    '/total',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getTotalInventoryItems
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