import Resume from "../models/resumeModels.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateResumeWithGemini } from "../services/geminiAI.js";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to calculate resume completion percentage
const calculateResumeCompletion = (resumeData) => {
  if (!resumeData) return 0;

  const weights = {
    profileInfo: 25,
    contactInfo: 20,
    workExperience: 25,
    education: 15,
    skills: 10,
    projects: 5
  };

  let totalScore = 0;

  // Profile Info (25%)
  if (resumeData.profileInfo) {
    let profileScore = 0;
    if (resumeData.profileInfo.fullName?.trim()) profileScore += 8;
    if (resumeData.profileInfo.designation?.trim()) profileScore += 7;
    if (resumeData.profileInfo.summary?.trim() && resumeData.profileInfo.summary.length > 50) profileScore += 10;
    totalScore += Math.min(profileScore, weights.profileInfo);
  }

  // Contact Info (20%)
  if (resumeData.contactInfo) {
    let contactScore = 0;
    if (resumeData.contactInfo.email?.trim()) contactScore += 8;
    if (resumeData.contactInfo.phone?.trim()) contactScore += 6;
    if (resumeData.contactInfo.location?.trim()) contactScore += 6;
    totalScore += Math.min(contactScore, weights.contactInfo);
  }

  // Work Experience (25%)
  if (resumeData.workExperience?.length > 0) {
    const validExperiences = resumeData.workExperience.filter(exp =>
      exp.company?.trim() && exp.role?.trim() && exp.description?.trim()
    );
    const experienceScore = Math.min(validExperiences.length * 8, weights.workExperience);
    totalScore += experienceScore;
  }

  // Education (15%)
  if (resumeData.education?.length > 0) {
    const validEducation = resumeData.education.filter(edu =>
      edu.degree?.trim() && edu.institution?.trim()
    );
    const educationScore = Math.min(validEducation.length * 7, weights.education);
    totalScore += educationScore;
  }

  // Skills (10%)
  if (resumeData.skills?.length > 0) {
    const validSkills = resumeData.skills.filter(skill => skill.name?.trim());
    const skillsScore = Math.min(validSkills.length * 2, weights.skills);
    totalScore += skillsScore;
  }

  // Projects (5%)
  if (resumeData.projects?.length > 0) {
    const validProjects = resumeData.projects.filter(project =>
      project.title?.trim() && project.description?.trim()
    );
    const projectsScore = Math.min(validProjects.length * 2.5, weights.projects);
    totalScore += projectsScore;
  }

  return Math.round(Math.min(totalScore, 100));
};

// Create a new resume
const createResume = async (req, res) => {
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
      interests,
      completion
    } = req.body;

    // Calculate completion percentage
    const resumeData = {
      profileInfo,
      contactInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests
    };
    const calculatedCompletion = calculateResumeCompletion(resumeData);

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
      interests,
      completion: completion || calculatedCompletion
    });

    await resume.save();

    res.status(201).json({
      message: "Resume created successfully",
      resumeId: resume._id,   // ✅ Send this explicitly
      resume
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating resume", error: error.message });
  }
};


// Fetch all resumes of logged-in user
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error: error.message });
  }
};

// Fetch a single resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume", error: error.message });
  }
};

// Update a resume
const updateResume = async (req, res) => {
  try {
    // Calculate completion percentage before updating
    const updatedData = { ...req.body };
    updatedData.completion = calculateResumeCompletion(updatedData);

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updatedData,
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume updated successfully", resume });
  } catch (error) {
    res.status(500).json({ message: "Error updating resume", error: error.message });
  }
};

// Upload resume image (dummy example: you can plug in multer or cloud storage here)
const uploadResumeImage = async (req, res) => {
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
const deleteResume = async (req, res) => {
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

// AI Resume Generation
const generateAIResume = async (req, res) => {
  try {
    const { userInput } = req.body;
    const userId = req.user._id;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ message: "User input is required for AI resume generation" });
    }

    console.log('Generating AI resume for user:', userId);
    console.log('User input:', userInput);

    // Generate resume using Gemini AI
    const aiGeneratedData = await generateResumeWithGemini(userInput);

    // Calculate completion for AI-generated data
    const calculatedCompletion = calculateResumeCompletion(aiGeneratedData);

    // Add user ID, completion, and timestamps
    const resumeData = {
      userId,
      ...aiGeneratedData,
      completion: calculatedCompletion,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create the resume with AI-generated data
    const newResume = new Resume(resumeData);
    const savedResume = await newResume.save();

    console.log('AI resume generated successfully:', savedResume._id);

    res.status(201).json({
      message: "AI resume generated successfully",
      resume: savedResume
    });

  } catch (error) {
    console.error("Error generating AI resume:", error);
    res.status(500).json({
      message: "Failed to generate AI resume",
      error: error.message
    });
  }
};

// Old helper functions removed - now using Gemini AI service

// All helper functions moved to Gemini AI service





export {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  uploadResumeImage,
  deleteResume,
  generateAIResume
};
