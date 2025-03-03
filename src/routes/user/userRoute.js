import express from "express";
import { userController } from "../../controller/index.js";

const router = express.Router();

// User routes
router.get("/", userController.getAll);
router.post("/", userController.create);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.deleteById);

export { router as userRouter };