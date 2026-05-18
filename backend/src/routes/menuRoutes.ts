import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createMenu, getMenus } from "../controllers/menuController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.MENU_CREATE),
    createMenu
);

router.get(
    '/',
    authenticate,
    hasAnyPermission(PERMISSIONS.MENU_READ_ALL),
    getMenus
)

const menuRoutes = router;

export default menuRoutes;