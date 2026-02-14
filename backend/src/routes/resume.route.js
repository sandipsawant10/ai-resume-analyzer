import { Router } from "express";
import upload from "../utils/multer.js";
import { uploadResume } from "../controllers/resume.controller.js";


const router = Router();

router.route("/upload").post(upload.single("resume"), uploadResume)

export default router;