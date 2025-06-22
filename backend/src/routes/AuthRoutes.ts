// src/routes/authRoutes.ts
import express from "express";
import AuthController from "../controllers/AuthController";
import { authenticateToken } from "../middleware/authMiddlware";

const router = express.Router();

router.post("/signup", AuthController.SignUp);
router.post("/signin", AuthController.SignIn);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/signout", authenticateToken, AuthController.SignOut); // Protected route

export default router;