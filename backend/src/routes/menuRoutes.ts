import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createMenu, deleteMenu, getMenus, updateMenu } from "../controllers/menuController";
import { handleMulterError, upload } from "../middlewares/multer";

const router = Router();

router.post(
    '/',
    upload.single("image"),
    handleMulterError,
    authenticate,
    authorizePermission(PERMISSIONS.MENU_CREATE),
    createMenu
);

router.put(
    '/:id',
    upload.single("image"),
    handleMulterError,
    authenticate,
    authorizePermission(PERMISSIONS.MENU_UPDATE),
    updateMenu
)

router.get(
    '/',
    authenticate,
    hasAnyPermission(PERMISSIONS.MENU_READ_ALL, PERMISSIONS.ORDER_CREATE),
    getMenus
)

router.delete(
    '/:id',
    authenticate,
    hasAnyPermission(PERMISSIONS.MENU_DELETE),
    deleteMenu
)

const menuRoutes = router;

export default menuRoutes;