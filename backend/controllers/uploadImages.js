import fs from "fs";
import path from "path";
import Resume from "../models/resumeModels.js";
import upload from "../middleware/uploadMiddleware.js"; // multer middleware

// Middleware to handle multipart form-data uploads
export const uploadResumeImageMiddleware = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

// Controller function expects multer to have populated req.files already
export const uploadResumeImage = async (req, res) => {
  try {
    const resumeId = req.params.id; // comes from /:id/upload-images
    const userId = req.user._id;    // protect middleware must set this

    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is missing in request params." });
    }

    // Find resume belonging to user
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const uploadsFolder = path.join(process.cwd(), "uploads");
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;

    // ✅ Handle thumbnail upload
    if (req.files?.thumbnail?.[0]) {
      // Delete old thumbnail if exists
      if (resume.thumbnailLink) {
        const oldThumbnailFilename = path.basename(resume.thumbnailLink);
        const oldThumbnailPath = path.join(uploadsFolder, oldThumbnailFilename);
        if (fs.existsSync(oldThumbnailPath)) {
          try {
            fs.unlinkSync(oldThumbnailPath);
          } catch (err) {
            console.warn("Failed to delete old thumbnail:", err);
          }
        }
      }
      // Save new thumbnail link
      resume.thumbnailLink = `${baseUrl}/${req.files.thumbnail[0].filename}`;
    }

    // ✅ Handle profile image upload
    if (req.files?.profileImage?.[0]) {
      // Delete old profile image if exists
      if (resume.profileInfo?.profileImg) {
        const oldProfileFilename = path.basename(resume.profileInfo.profileImg);
        const oldProfilePath = path.join(uploadsFolder, oldProfileFilename);
        if (fs.existsSync(oldProfilePath)) {
          try {
            fs.unlinkSync(oldProfilePath);
          } catch (err) {
            console.warn("Failed to delete old profile image:", err);
          }
        }
      }
      // Ensure profileInfo object exists
      if (!resume.profileInfo) resume.profileInfo = {};
      resume.profileInfo.profileImg = `${baseUrl}/${req.files.profileImage[0].filename}`;
    }

    // Save updated resume doc
    await resume.save();

    res.json({
      message: "Images uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    res.status(500).json({
      message: "Error uploading image",
      error: error.message,
    });
  }
};
