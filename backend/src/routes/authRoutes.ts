import { Router } from "express";
import { login, refreshAccessToken } from "../controllers/authController";

const router = Router();

router.post('/login', login);

router.post('/refreshToken', refreshAccessToken);

const authRoutes = router;

export default authRoutes;