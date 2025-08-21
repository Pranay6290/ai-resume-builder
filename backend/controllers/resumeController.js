import Resume from "../models/resumeModels.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      return res.status(400).json({ message: "User input is required" });
    }

    // Parse user input into resume data
    const aiGeneratedData = parseUserInputToResumeData(userInput);

    // Create the resume with AI-generated data
    const newResume = new Resume({
      userId,
      ...aiGeneratedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedResume = await newResume.save();
    res.status(201).json(savedResume);

  } catch (error) {
    console.error("Error generating AI resume:", error);
    res.status(500).json({ message: "Failed to generate AI resume", error: error.message });
  }
};

// Helper function to parse user input into resume data
const parseUserInputToResumeData = (input) => {
  const words = input.toLowerCase();

  return {
    title: `AI Generated Resume - ${new Date().toLocaleDateString()}`,
    profileInfo: {
      fullName: extractName(input) || "Professional Name",
      designation: extractRole(words) || "Professional",
      summary: generateSummary(input)
    },
    contactInfo: {
      email: extractEmail(input) || "professional@email.com",
      phone: extractPhone(input) || "+1 (555) 123-4567",
      location: extractLocation(input) || "City, State"
    },
    workExperience: generateWorkExperience(words),
    education: generateEducation(words),
    skills: generateSkills(words),
    projects: generateProjects(words),
    certifications: [],
    languages: [{ name: "English", proficiency: "Native" }],
    interests: generateInterests(words),
    template: {
      id: "01",
      theme: "01",
      colorPalette: []
    }
  };
};

// Helper functions for AI parsing
const extractName = (input) => {
  const namePatterns = [/my name is ([a-zA-Z\s]+)/i, /i'm ([a-zA-Z\s]+)/i, /i am ([a-zA-Z\s]+)/i];
  for (const pattern of namePatterns) {
    const match = input.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractRole = (words) => {
  const roles = {
    'software engineer': 'Software Engineer',
    'developer': 'Software Developer',
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'fullstack': 'Full Stack Developer',
    'marketing': 'Marketing Professional',
    'designer': 'Designer',
    'manager': 'Manager',
    'analyst': 'Business Analyst'
  };

  for (const [key, value] of Object.entries(roles)) {
    if (words.includes(key)) return value;
  }
  return 'Professional';
};

const generateSummary = (input) => {
  const sentences = input.split('.').filter(s => s.trim().length > 10);
  return sentences.slice(0, 3).join('. ') + '.';
};

const extractEmail = (input) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = input.match(emailRegex);
  return match ? match[0] : null;
};

const extractPhone = (input) => {
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const match = input.match(phoneRegex);
  return match ? match[0] : null;
};

const extractLocation = (input) => {
  const locationPatterns = [/in ([a-zA-Z\s,]+)/i, /from ([a-zA-Z\s,]+)/i, /located in ([a-zA-Z\s,]+)/i];
  for (const pattern of locationPatterns) {
    const match = input.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const generateWorkExperience = (words) => {
  const experienceYears = extractYearsOfExperience(words);
  const role = extractRole(words);

  return [{
    jobTitle: role,
    companyName: "Previous Company",
    startDate: new Date(new Date().getFullYear() - experienceYears, 0).toISOString(),
    endDate: new Date().toISOString(),
    isCurrentJob: true,
    responsibilities: [
      "Led development of key features and improvements",
      "Collaborated with cross-functional teams",
      "Delivered high-quality solutions on time"
    ]
  }];
};

const extractYearsOfExperience = (words) => {
  const yearMatches = words.match(/(\d+)\s*years?/);
  return yearMatches ? parseInt(yearMatches[1]) : 2;
};

const generateEducation = (words) => {
  const degrees = {
    'computer science': 'Bachelor of Science in Computer Science',
    'business': 'Bachelor of Business Administration',
    'marketing': 'Bachelor of Marketing',
    'engineering': 'Bachelor of Engineering',
    'design': 'Bachelor of Design'
  };

  let degree = 'Bachelor of Science';
  for (const [key, value] of Object.entries(degrees)) {
    if (words.includes(key)) {
      degree = value;
      break;
    }
  }

  return [{
    institutionName: "University Name",
    degree: degree,
    fieldOfStudy: "Relevant Field",
    startDate: new Date(2018, 8).toISOString(),
    endDate: new Date(2022, 4).toISOString(),
    grade: "3.7 GPA"
  }];
};

const generateSkills = (words) => {
  const skillsMap = {
    'react': 'React',
    'javascript': 'JavaScript',
    'python': 'Python',
    'node': 'Node.js',
    'html': 'HTML',
    'css': 'CSS',
    'sql': 'SQL',
    'git': 'Git',
    'aws': 'AWS',
    'docker': 'Docker',
    'marketing': 'Digital Marketing',
    'photoshop': 'Adobe Photoshop'
  };

  const detectedSkills = [];
  for (const [key, value] of Object.entries(skillsMap)) {
    if (words.includes(key)) {
      detectedSkills.push({
        name: value,
        progress: Math.floor(Math.random() * 30) + 70
      });
    }
  }

  if (detectedSkills.length === 0) {
    detectedSkills.push(
      { name: 'Communication', progress: 90 },
      { name: 'Problem Solving', progress: 85 },
      { name: 'Teamwork', progress: 88 }
    );
  }

  return detectedSkills;
};

const generateProjects = (words) => {
  return [{
    title: "Professional Project",
    description: "Developed and implemented a comprehensive solution that improved efficiency and user experience.",
    technologies: ["Technology 1", "Technology 2"],
    startDate: new Date(2023, 0).toISOString(),
    endDate: new Date(2023, 6).toISOString(),
    projectLink: "",
    githubLink: ""
  }];
};

const generateInterests = (words) => {
  const commonInterests = ['Technology', 'Innovation', 'Learning', 'Problem Solving'];
  return commonInterests.slice(0, 3);
};

export {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  uploadResumeImage,
  deleteResume,
  generateAIResume
};
