import Resume from "../models/resumeModels.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new resume
// Create a new resume
export const createResume = async (req, res) => {
  try {
    const {
      title,
      template,
      profileInfo,
      contactInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests
    } = req.body;

    const resume = new Resume({
      userId: req.user._id,
      title,
      template,
      profileInfo,
      contactInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests
    });

    await resume.save();

    res.status(201).json({
      message: "Resume created successfully",
      resumeId: resume._id,   // ✅ Send this explicitly
      
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating resume", error: error.message });
  }
};


// Fetch all resumes of logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error: error.message });
  }
};

// Fetch a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume", error: error.message });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume updated successfully", resume });
  } catch (error) {
    res.status(500).json({ message: "Error updating resume", error: error.message });
  }
};

// Upload resume image (dummy example: you can plug in multer or cloud storage here)
export const uploadResumeImage = async (req, res) => {
  try {
    // Example: assume image URL/path comes in body
    const { imageUrl } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { "profileInfo.profilePreviewUrl": imageUrl } },
      { new: true }
    );

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.json({ message: "Image uploaded successfully", resume });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const uploadsFolder = path.join(__dirname, "../uploads");

    if (resume.thumbnailLink) {
  const oldThumbnailFilename = path.basename(resume.thumbnailLink);
  const oldThumbnailPath = path.join(uploadsFolder, oldThumbnailFilename);
  if (fs.existsSync(oldThumbnailPath)) {
    fs.unlinkSync(oldThumbnailPath);
  }

}

if (resume.profileInfo?.profilePreviewUrl) {
  const oldProfileFilename = path.basename(resume.profileInfo.profilePreviewUrl);
  const oldProfilePreviewPath = path.join(uploadsFolder, oldProfileFilename);
  if (fs.existsSync(oldProfilePreviewPath)) {
    fs.unlinkSync(oldProfilePreviewPath);
  }
}


    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume", error: error.message });
  }
};
