import { Router } from "express";
import { getStockInHistory } from "../controllers/stockInController";

const router = Router();

router.get(
    '/',
    getStockInHistory
)

const stockInRoutes = router;

export default stockInRoutes;