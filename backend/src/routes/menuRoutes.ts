import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createMenu, getMenus, updateMenu } from "../controllers/menuController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.MENU_CREATE),
    createMenu
);

router.put(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.MENU_UPDATE),
    updateMenu
)

router.get(
    '/',
    authenticate,
    hasAnyPermission(PERMISSIONS.MENU_READ_ALL),
    getMenus
)

const menuRoutes = router;

export default menuRoutes;