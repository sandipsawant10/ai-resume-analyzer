import { Router } from "express";
import upload from "../utils/multer";
import { uploadResume } from "../controllers/resume.controller.js";


const router = Router();

router.route("/upload").post(upload.single("resume"), uploadResume)

export default router;