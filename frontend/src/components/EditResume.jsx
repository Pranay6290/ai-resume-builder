import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Input,TitleInput } from "../components/Inputs";
import { buttonStyles, containerStyles, iconStyles, statusStyles } from "../assets/dummystyle";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {AlertCircle, ArrowLeft, Download, Loader2, Palette ,Check,Save, Trash2, Sparkles, Shield} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import StepProgress from "../components/StepProgress";
import RenderResume from "../components/RenderResume";
import ProfileInfoForm from "../components/ProfileInfoForm";
import Modal from "../components/Modal";
import ThemeSelector from "../components/ThemeSelector";
import { useTheme } from "../context/themeContext";
import { ContactInfoForm,WorkExperienceForm,EducationDetailsForm,SkillsInfoForm,ProjectDetailForm,CertificationInfoForm,AdditionalInfoForm } from "./Forms";
import { generateThumbnail, exportWithQuality, downloadPDF } from "../utils/pdfExport";
import { showSuccessToast, showErrorToast } from "./NotificationSystem";
import LivePreview from "./LivePreview";
import { dataURLtoFile } from "../utils/helper";
import ResumeOptimizer from "./ResumeOptimizer";
import ATSScoreChecker from "./ATSScoreChecker";

// Removed unused useResizeObserver hook



const EditResume = () => {

  const { resumeId } = useParams();
  const navigate = useNavigate();
  const resumeDownloadRef = useRef(null);
  const thumbnailRef = useRef(null);
  const { applyTheme, currentTheme, setCurrentTheme } = useTheme();

  const [openThemeSelector, setOpenThemeSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);

  // Check if this is an uploaded resume
  const location = useLocation();
  const isUploadedResume = new URLSearchParams(location.search).get('uploaded') === 'true';

  // const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: []
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  })

  // Calculate completion percentage with strict validation
  const calculateCompletion = () => {
    if (!resumeData) return 0;

    // Helper function to check if content is meaningful
    const isMeaningfulContent = (content) => {
      if (!content) return false;
      const trimmed = content.toString().trim();
      // Must be at least 2 characters and not just spaces/special chars
      return trimmed.length >= 2 && /[a-zA-Z0-9]/.test(trimmed);
    };

    // Helper function to check if email is valid format
    const isValidEmail = (email) => {
      if (!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    };

    // Helper function to check if phone is meaningful
    const isMeaningfulPhone = (phone) => {
      if (!phone) return false;
      const cleaned = phone.replace(/[^\d]/g, '');
      return cleaned.length >= 10; // At least 10 digits
    };

    // Core required sections (always counted in total weight)
    const coreRequiredSections = [
      {
        name: 'Profile Info',
        weight: 20, // Reduced weight
        fields: [
          {
            value: resumeData.profileInfo?.fullName,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2,
            required: true
          },
          {
            value: resumeData.profileInfo?.designation,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3,
            required: true
          },
          {
            value: resumeData.profileInfo?.summary,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 30, // Increased requirement
            required: true
          }
        ]
      },
      {
        name: 'Contact Info',
        weight: 15,
        fields: [
          {
            value: resumeData.contactInfo?.email,
            validator: isValidEmail,
            required: true
          },
          {
            value: resumeData.contactInfo?.phone,
            validator: isMeaningfulPhone,
            required: true
          },
          {
            value: resumeData.contactInfo?.location,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3,
            required: false
          }
        ]
      },
      {
        name: 'Work Experience',
        weight: 30, // Increased weight - most important
        fields: [],
        required: true,
        minEntries: 1
      },
      {
        name: 'Education',
        weight: 20,
        fields: [],
        required: true,
        minEntries: 1
      },
      {
        name: 'Skills',
        weight: 15,
        fields: [],
        required: true,
        minEntries: 3 // At least 3 skills
      }
    ];

    // Populate dynamic fields for work experience
    if (resumeData.workExperience?.length > 0) {
      const workFields = [];
      resumeData.workExperience.forEach(exp => {
        workFields.push(
          { value: exp.jobTitle, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3, required: true },
          { value: exp.companyName, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2, required: true },
          { value: exp.startDate, validator: (val) => !!val, required: true },
          { value: exp.responsibilities?.length > 0 ? exp.responsibilities.join(' ') : '', validator: (val) => val && val.length >= 20, required: true }
        );
      });
      coreRequiredSections[2].fields = workFields;
    }

    // Populate dynamic fields for education
    if (resumeData.education?.length > 0) {
      const eduFields = [];
      resumeData.education.forEach(edu => {
        eduFields.push(
          { value: edu.degree, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3, required: true },
          { value: edu.institution, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3, required: true },
          { value: edu.startDate, validator: (val) => !!val, required: true }
        );
      });
      coreRequiredSections[3].fields = eduFields;
    }

    // Populate dynamic fields for skills
    if (resumeData.skills?.length > 0) {
      const skillFields = resumeData.skills.map(skill => ({
        value: skill.name,
        validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2,
        required: true
      }));
      coreRequiredSections[4].fields = skillFields;
    }

    // Calculate completion with strict requirements
    let totalScore = 0;
    let totalWeight = 100; // Always use full weight for realistic calculation

    coreRequiredSections.forEach(section => {
      let sectionScore = 0;

      if (section.name === 'Work Experience') {
        // Work experience needs at least 1 complete entry
        const hasMinEntries = resumeData.workExperience?.length >= (section.minEntries || 1);
        if (hasMinEntries && section.fields.length > 0) {
          const validFields = section.fields.filter(field => field.validator(field.value)).length;
          sectionScore = (validFields / section.fields.length);
        }
      } else if (section.name === 'Education') {
        // Education needs at least 1 complete entry
        const hasMinEntries = resumeData.education?.length >= (section.minEntries || 1);
        if (hasMinEntries && section.fields.length > 0) {
          const validFields = section.fields.filter(field => field.validator(field.value)).length;
          sectionScore = (validFields / section.fields.length);
        }
      } else if (section.name === 'Skills') {
        // Skills need at least 3 skills
        const hasMinEntries = resumeData.skills?.length >= (section.minEntries || 3);
        if (hasMinEntries && section.fields.length > 0) {
          const validFields = section.fields.filter(field => field.validator(field.value)).length;
          sectionScore = (validFields / section.fields.length);
        }
      } else {
        // Profile Info and Contact Info
        if (section.fields.length > 0) {
          const validFields = section.fields.filter(field => field.validator(field.value)).length;
          const requiredFields = section.fields.filter(field => field.required !== false).length;

          // Only count if at least all required fields are filled
          if (validFields >= requiredFields) {
            sectionScore = (validFields / section.fields.length);
          } else {
            // Partial credit for required fields only
            sectionScore = Math.min(0.5, validFields / requiredFields) * 0.5; // Max 25% for incomplete required fields
          }
        }
      }

      totalScore += sectionScore * section.weight;
    });

    // Calculate final percentage with stricter thresholds
    const finalPercentage = Math.round((totalScore / totalWeight) * 100);

    // Apply realistic thresholds
    let adjustedPercentage;
    if (finalPercentage < 5) {
      adjustedPercentage = 0; // Too minimal to show any progress
    } else if (finalPercentage < 15) {
      adjustedPercentage = Math.max(1, Math.round(finalPercentage * 0.5)); // Reduce very low percentages
    } else {
      adjustedPercentage = Math.max(0, Math.min(100, finalPercentage));
    }

    setCompletionPercentage(adjustedPercentage);
    return adjustedPercentage;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);


      // Validate Inputs
  const validateAndNext = () => {
    const errors = []

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo
        if (!fullName.trim()) errors.push("Full Name is required")
        if (!designation.trim()) errors.push("Designation is required")
        if (!summary.trim()) errors.push("Summary is required")
        break

      case "contact-info":
        const { email, phone } = resumeData.contactInfo
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
        if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
        break

      case "work-experience":
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
          if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`)
          if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`)
        })
        break

      case "education-info":
        resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
          if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
          if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`)
        })
        break

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
          if (progress < 1 || progress > 100)
            errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
        })
        break

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`)
          if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`)
        })
        break

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`)
          if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
        })
        break

      case "additionalInfo":
        if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("At least one language is required")
        }
        if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("At least one interest is required")
        }
        break

      default:
        break
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "))
      return
    }

    setErrorMsg("")
    goToNextStep()
  }

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "additionalInfo") setOpenPreviewModal(true)

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentPage(pages[nextIndex])

      const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "profile-info") navigate("/dashboard")

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentPage(pages[prevIndex])

      const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onNext={validateAndNext}
            currentTheme={currentTheme}
            resumeData={resumeData}
          />
        )

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => updateSection("contactInfo", key, value)}
          />
        )

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        )

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        )

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        )

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        )

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        )

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        )

      default:
        return null
    }
  }


  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]

      if (key === null) {
        updatedArray[index] = value
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

    const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]
      updatedArray.splice(index, 1)
      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }


  // Enhanced Save and Exit function
  const saveAndExit = async () => {
    if (!resumeId) {
      showErrorToast("Resume ID is missing. Cannot save resume.");
      return;
    }

    try {
      setIsLoading(true);

      // First save the resume data
      await updateResumeDetails();

      // Generate thumbnail if possible
      try {
        if (thumbnailRef.current) {
          const thumbnailDataUrl = await generateThumbnail(thumbnailRef, {
            width: 300,
            height: 400,
            format: 'png'
          });

          const thumbnailFile = dataURLtoFile(
            thumbnailDataUrl,
            `thumbnail-${resumeId}.png`
          );

          const formData = new FormData();
          formData.append("thumbnail", thumbnailFile);

          await axiosInstance.post(
            API_PATHS.RESUMES.UPLOAD_IMAGES(resumeId),
            formData,
            { headers: { "Content-Type": "multipart/form-data" }}
          );
        }
      } catch (thumbnailError) {
        // Don't fail the save operation if thumbnail generation fails
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to generate thumbnail:", thumbnailError);
        }
      }
      showSuccessToast("Resume saved successfully!");

      // Small delay to ensure the toast is visible before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Error saving resume:", error);
      showErrorToast(`Failed to save resume: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy function for backward compatibility
  const uploadResumeImages = saveAndExit;

const fetchResumeDetailsById = async () => {
  if (!resumeId) {
    showErrorToast("Resume ID is missing. Cannot fetch resume details.");
    return;
  }

  try {
    const response = await axiosInstance.get(API_PATHS.RESUMES.GET_BY_ID(resumeId));

    if (response.data) {
      // Handle different response structures
      const resumeInfo = response.data.resume || response.data;

      if (resumeInfo) {
        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template || { id: "01", theme: "professional" },
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo || {},
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo || {},
          workExperience: resumeInfo?.workExperience || prevState?.workExperience || [],
          education: resumeInfo?.education || prevState?.education || [],
          skills: resumeInfo?.skills || prevState?.skills || [],
          projects: resumeInfo?.projects || prevState?.projects || [],
          certifications: resumeInfo?.certifications || prevState?.certifications || [],
          languages: resumeInfo?.languages || prevState?.languages || [],
          interests: resumeInfo?.interests || prevState?.interests || [],
        }));

        // Set current theme from loaded data
        if (resumeInfo?.template?.theme) {
          setCurrentTheme(resumeInfo.template.theme);
        }

        showSuccessToast("Resume loaded successfully!");
      } else {
        showErrorToast("Resume data not found");
      }
    }
  } catch (error) {
    console.error("Error fetching resume:", error);
    const errorMessage = error.response?.data?.message || "Failed to load resume data";
    showErrorToast(errorMessage);
  }
};

const updateResumeDetails = async (thumbnailLink) => {
  if (!resumeId) {
    showErrorToast("Resume ID is missing. Cannot update resume.");
    return;
  }

  try {
    setIsLoading(true);

    // Use PUT method for updating
    const response = await axiosInstance.put(API_PATHS.RESUMES.UPDATE(resumeId), {
      ...resumeData,
      thumbnailLink: thumbnailLink || "",
      completion: completionPercentage,
    });

    showSuccessToast("Resume updated successfully!");
    return response.data;
  } catch (err) {
    console.error("Error updating resume:", err);
    showErrorToast("Failed to update resume details");
    throw err; // rethrow so caller can catch if needed
  } finally {
    setIsLoading(false);
  }
};


//Delete function to delete any resume
      const handleDeleteResume = async () => {
        if (!resumeId) {
    toast.error("Resume ID is missing. Cannot delete resume.");
    return;
  }
    try {
      setIsLoading(true)
      await axiosInstance.delete(API_PATHS.RESUMES.DELETE(resumeId))
      toast.success("Resume deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    } finally {
      setIsLoading(false)
    }
  }

      const handleDownloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      showErrorToast("Failed to generate PDF. Please try again.");
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const filename = `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;

      await showProgressToast(
        'Generating high-quality PDF...',
        exportWithQuality(resumeDownloadRef, 'high', { filename }),
        {
          successMessage: 'PDF downloaded successfully!',
          errorMessage: 'Failed to generate PDF. Please try again.'
        }
      );

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        setOpenPreviewModal(false);
      }, 2000);

    } catch (error) {
      console.error("PDF generation failed:", error);
      showErrorToast("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateTheme = (theme) => {
    // Update resume data
    setResumeData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        theme: theme,
        colorPalette: []
      }
    }));

    // Apply theme globally for live preview
    if (applyTheme) {
      applyTheme(theme); // Apply the new theme, not currentTheme
    }
  }

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById()
    }
  }, [resumeId])

  return (
    <DashboardLayout>
      <div className={containerStyles.main}>
        <div className={containerStyles.header}>
           <TitleInput
  title={resumeData.title}
  setTitle={(newTitle) =>
    setResumeData((prev) => ({ ...prev, title: newTitle }))
  }
/>

    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => setOpenThemeSelector(true)} className={buttonStyles.theme}>
        <Palette size={16}/>
        <span className='text-sm'>Theme</span>
      </button>

      <button onClick={() => setShowOptimizer(true)} className={buttonStyles.theme}>
        <Sparkles size={16}/>
        <span className='text-sm'>Optimize</span>
      </button>

      <button onClick={() => setShowATSChecker(true)} className={buttonStyles.theme}>
        <Shield size={16}/>
        <span className='text-sm'>ATS Score</span>
      </button>

      <button onClick={handleDeleteResume} className={buttonStyles.delete} disabled={isLoading}>
        <Trash2 size={16}/>
        <span className='text-sm'>Delete</span>
      </button>

      <button onClick={() => setOpenPreviewModal(true)} className={buttonStyles.download}>
        <Download size={16}/>
        <span className='text-sm'>Preview</span>
      </button>
    </div>
  </div>

  {/*Step progress */}
  <div className={containerStyles.grid}>
    <div className={containerStyles.formContainer}>
      <StepProgress progress={progress} />

      {/* Uploaded Resume Banner */}
      {isUploadedResume && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Resume Uploaded Successfully!</h3>
                <p className="text-gray-600">Your resume has been parsed and is ready for optimization.</p>
              </div>
            </div>
            <button
              onClick={() => setShowOptimizer(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles size={20} />
              Optimize This Resume
            </button>
          </div>
        </div>
      )}

      {renderForm()}
      <div className="p-4 sm:p-6">
        {errorMsg && (
          <div className={statusStyles.error}><AlertCircle size={16}/>{errorMsg}</div>
        )}
        <div className="flex flex-wrap items-center justify-center">
          <button className={buttonStyles.back} onClick={goBack} disabled={isLoading}>
          <ArrowLeft size={16}/>
          Go Back
          </button>

          <button className={buttonStyles.save} onClick={uploadResumeImages} disabled={isLoading}>
  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
  {isLoading ? "Saving..." : "Save & Exit"}
</button>


          <button className={buttonStyles.next} onClick={validateAndNext} disabled={isLoading}>
            {currentPage === "additionalInfo" && <Download size={16}/>}
            {currentPage === "additionalInfo" ? "Preview and Download" : "Next"}
            {currentPage === "additionalInfo" && <ArrowLeft size={16} className="rotate-180"/>}
          </button>
        </div>
      </div>
    </div>

          <div className="hidden lg:block">
            <div className="h-full">
              <div className="text-center mb-4">
                 <div className={statusStyles.completionBadge}>
                      <div className={iconStyles.pulseDot}></div>
                      <span>Preview - {completionPercentage}% Complete</span>
                 </div>
              </div>

              <LivePreview
                resumeData={resumeData}
                templateId={resumeData?.template?.theme || "01"}
                className="h-[calc(100vh-200px)]"
                showControls={true}
                autoUpdate={true}
                currentTheme={currentTheme}
                onThumbnailGenerated={(thumbnail) => {
                  // Handle thumbnail generation for dashboard
                  console.log('Thumbnail generated:', thumbnail);
                }}
              />
            </div>
          </div>
    </div>
</div>


          {/*Modal Data here */}
          <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)}
            title="Customize Theme & Template">
              <div className={containerStyles.modalContent}>
            <ThemeSelector
              selectedTheme={resumeData?.template.theme}
              setSelectedTheme={updateTheme}
              onClose={() => setOpenThemeSelector(false)}
              resumeData={resumeData}
              onApplyTheme={(themeConfig) => {
                // Update both template and color theme
                setResumeData(prev => ({
                  ...prev,
                  template: {
                    ...prev.template,
                    theme: themeConfig.templateId || themeConfig.colorTheme,
                    colorTheme: themeConfig.colorTheme
                  }
                }));

                // Apply theme globally for live preview
                const themeToApply = themeConfig.colorTheme || themeConfig.templateId;
                if (themeToApply && applyTheme) {
                  applyTheme(themeToApply);
                }
              }}
            />
            </div>
          </Modal>

          <Modal isOpen={openPreviewModal} onClose={() => setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText={isDownloading ? "Generating..."
            : downloadSuccess ? "Downloading..." : "Download PDF" }

            actionBtnIcon={isDownloading?(
              <Loader2 size={16} className="animate-spin"/>
            ): downloadSuccess ? (
              <Check size={16} className="text-white"/>
            ) : (
              <Download size={16}/>
            )}
            onActionClick={handleDownloadPDF}
            >
              <div className="relative">
                  <div className="text-center mb-4">
                      <div className={statusStyles.modalBadge}>
                          <div className={iconStyles.pulseDot}></div>
                          <span>Completion - {completionPercentage}%</span>
                      </div>
                  </div>

                  <div className={containerStyles.pdfPreview}>
                      <div ref={resumeDownloadRef} className="a4-wrapper">
                          <div className="w-full h-full">
                              <RenderResume
                                  key={`pdf-${resumeData?.template?.theme || currentTheme}`}
                                  resumeData={resumeData}
                                  templateId={resumeData?.template?.theme || currentTheme || "01"}
                                  colorTheme={currentTheme}
                                  containerWidth={null}
                              />
                          </div>
                      </div>
                  </div>
              </div>
            </Modal>

            {/*Now thumbnail issue fix */}
              <div style={{display: 'none'}} ref={thumbnailRef}>
                  <div className={containerStyles.hiddenThumbnail}>
                      <RenderResume
                          key={`thumb-${resumeData?.template?.theme || currentTheme}`}
                          resumeData={resumeData}
                          templateId={resumeData?.template?.theme || currentTheme || "01"}
                          colorTheme={currentTheme}
                      />
                  </div>
              </div>

          {/* Resume Optimizer Modal */}
          <Modal
            isOpen={showOptimizer}
            onClose={() => setShowOptimizer(false)}
            title="AI Resume Optimizer"
            size="large"
          >
            <ResumeOptimizer
              resumeData={resumeData}
              onOptimizedResume={(optimizedData) => {
                setResumeData(optimizedData);
                calculateCompletion();
              }}
              onClose={() => setShowOptimizer(false)}
            />
          </Modal>

          {/* ATS Score Checker Modal */}
          <Modal
            isOpen={showATSChecker}
            onClose={() => setShowATSChecker(false)}
            title="ATS Compatibility Checker"
            size="large"
          >
            <ATSScoreChecker
              resumeData={resumeData}
              onClose={() => setShowATSChecker(false)}
            />
          </Modal>
</DashboardLayout>
)
}

export default EditResume
