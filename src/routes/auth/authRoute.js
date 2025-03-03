import express from "express";
import { authController } from "../../controller/index.js";

const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected routes
router.get("/init", authController.init);

export { router as authRouter };