import { Router } from "express";
import upload from "../middleware/multer.js";
import {
  uploadResume,
  getMyResumes,
  deleteResume,
  updateResume,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";

const router = Router();

router.route("/upload").post(verifyJWT, upload.single("resume"), uploadResume);
router.route("/my").get(verifyJWT, getMyResumes);
router.route("/my/:id").delete(verifyJWT, deleteResume);
router.route("/my/:id").put(verifyJWT, upload.single("resume"), updateResume);

export default router;
