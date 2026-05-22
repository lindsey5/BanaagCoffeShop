import { Router } from "express";
import { changePassword, createUser, deleteUser, getTotalUsers, getUsers, isEmailExist, updateUser, userGetOwn, userUpdateOwn } from "../controllers/userController";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";

const router = Router();

router.post(
    '/', 
    authenticate, 
    authorizePermission(PERMISSIONS.USER_CREATE),
    createUser
);

router.get(
    '/email',
    authenticate,
    hasAnyPermission(PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE),
    isEmailExist
)

router.get(
    '/', 
    authenticate,
    authorizePermission(PERMISSIONS.USER_READ_ALL),
    getUsers
);

router.get(
    '/total',
    authenticate,
    authorizePermission(PERMISSIONS.DASHBOARD_VIEW),
    getTotalUsers
)

router.put(
    '/me',
    authenticate,
    userUpdateOwn
)

router.put(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.USER_UPDATE),
    updateUser
)

router.patch(
    '/change-password',
    authenticate,
    changePassword
)

router.get(
    '/me',
    authenticate,
    userGetOwn
)

router.delete(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.USER_DELETE),
    deleteUser
)

const userRoutes = router

export default userRoutes;