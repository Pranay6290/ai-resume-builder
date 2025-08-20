import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  template: {
    colorPalette: [String] // store multiple colors
  },
  profileInfo: {
    profileImg: { type: String, default: null },
    previewUrl: { type: String, default: '' },
    fullName: { type: String, default: '' },
    designation: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  contactInfo: {
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String
  },
  workExperience: [
    {
      company: String,
      role: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      startDate: Date,
      endDate: Date
    }
  ],
  skills: [
    {
      name: String,
      progress: { type: Number, default: 0 } // % skill level
    }
  ],
  projects: [
    {
      title: String,
      description: String,
      github: String,
      liveDemo: String
    }
  ],
  certifications: [
    {
      title: String,
      issuer: String,
      year: Number
    }
  ],
  languages: [
    {
      name: String,
      progress: { type: Number, default: 0 } // % proficiency
    }
  ],
  interests: [String]
}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
