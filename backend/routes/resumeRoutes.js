import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  uploadResumeImage,
  deleteResume,
  generateAIResume
} from "../controllers/resumeController.js";
import upload from "../middleware/uploadMiddleware.js";




const resumeRouter = express.Router();

// Create new resume
resumeRouter.post("/", protect, createResume);

// Get all resumes of logged-in user
resumeRouter.get("/", protect, getUserResumes);

// Get resume by ID
resumeRouter.get("/:id", protect, getResumeById);

// Update resume
resumeRouter.put("/:id", protect, updateResume);

// Upload resume image(s)
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

resumeRouter.post(
  "/:id/upload-images",
  protect,
  uploadFields,
  uploadResumeImage
);


// Delete resume
resumeRouter.delete("/:id", protect, deleteResume);

// AI Resume Generation
resumeRouter.post("/ai-generate", protect, generateAIResume);

export default resumeRouter;
