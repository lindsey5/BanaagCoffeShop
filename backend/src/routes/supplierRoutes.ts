import { Router } from "express";
import { authenticate, authorizePermission, hasAnyPermission } from "../middlewares/authMiddleware";
import PERMISSIONS from "../utils/permissions";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../controllers/supplierController";


const router = Router();

router.get(
    '/',
    authenticate,
    hasAnyPermission(PERMISSIONS.SUPPLIER_READ_ALL, PERMISSIONS.PURCHASE_ORDER_CREATE),
    getSuppliers
)

router.post(
    '/',
    authenticate,
    authorizePermission(PERMISSIONS.SUPPLIER_CREATE),
    createSupplier
)

router.put(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.SUPPLIER_UPDATE),
    updateSupplier
)

router.delete(
    '/:id',
    authenticate,
    authorizePermission(PERMISSIONS.SUPPLIER_DELETE),
    deleteSupplier
)

const supplierRoutes = router;

export default supplierRoutes;