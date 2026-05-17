import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createRole, deleteRole, getAllRoles, getOwnRole, getRoleById, updateRole } from "../controllers/roleController";

const router = Router();

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.ROLE_CREATE),
    createRole
);

router.get(
    '/',
    authenticate,
    hasAnyPermission(
        PERMISSIONS.ROLE_READ_ALL, 
        PERMISSIONS.USER_CREATE, 
        PERMISSIONS.USER_READ_ALL, 
        PERMISSIONS.USER_DELETE, 
        PERMISSIONS.USER_UPDATE
    ),
    getAllRoles
)

router.get(
    '/me',
    authenticate,
    getOwnRole
)

router.get(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.ROLE_UPDATE),
    getRoleById
)

router.put(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.ROLE_UPDATE),
    updateRole
)

router.delete(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.ROLE_DELETE),
    deleteRole
)

const roleRoutes = router

export default roleRoutes;