import express from "express";
import upload from "../../middleware/multerConfig.js";
import { uploadFile } from "../../controller/file/fileController.js";

const router = express.Router();

// File upload route
router.post("/upload", upload.single("file"), uploadFile);

export { router as uploadRouter };