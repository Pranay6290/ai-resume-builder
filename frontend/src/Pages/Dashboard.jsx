import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { dashboardStyles as styles } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { LucideFilePlus, LucideTrash2, Search, Filter, Grid, List, Download, Share2, Plus, Sparkles, Upload, FileText } from "lucide-react";
import { extractTextFromFile, parseResumeContent } from "../utils/resumeExtractor";
import { ResumeSummaryCard } from "../components/Cards";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../components/Modal";
import CreateResumeForm from "../components/CreateResumeForm";
import { showSuccessToast, showErrorToast } from "../components/NotificationSystem";
import ShareResumeModal from "../components/ShareResumeModal";
import EnhancedButton from "../components/EnhancedButton";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Enhanced UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("updatedAt"); // updatedAt, createdAt, title, completion
  const [filterBy, setFilterBy] = useState("all"); // all, completed, draft
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedResumeForShare, setSelectedResumeForShare] = useState(null);

  // Calculate completion percentage for a resume with intelligent validation
  const calculateCompletion = (resume) => {
    if (!resume) return 0;

    // Helper function to check if content is meaningful
    const isMeaningfulContent = (content) => {
      if (!content) return false;
      const trimmed = content.toString().trim();
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
      return cleaned.length >= 10;
    };

    // Define sections with their weights and validation rules
    const sections = [
      {
        name: 'Profile Info',
        weight: 35,
        fields: [
          {
            value: resume.profileInfo?.fullName,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2
          },
          {
            value: resume.profileInfo?.designation,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3
          },
          {
            value: resume.profileInfo?.summary,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 20
          }
        ]
      },
      {
        name: 'Contact Info',
        weight: 15,
        fields: [
          {
            value: resume.contactInfo?.email,
            validator: isValidEmail
          },
          {
            value: resume.contactInfo?.phone,
            validator: isMeaningfulPhone
          },
          {
            value: resume.contactInfo?.location,
            validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3
          }
        ]
      }
    ];

    // Add dynamic sections only if they have content
    if (resume.workExperience?.length > 0) {
      const workFields = [];
      resume.workExperience.forEach(exp => {
        workFields.push(
          { value: exp.jobTitle, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3 },
          { value: exp.companyName, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2 },
          { value: exp.startDate, validator: (val) => !!val },
          { value: exp.responsibilities?.length > 0 ? exp.responsibilities.join(' ') : '', validator: (val) => val && val.length >= 10 }
        );
      });

      if (workFields.length > 0) {
        sections.push({
          name: 'Work Experience',
          weight: 25,
          fields: workFields
        });
      }
    }

    if (resume.education?.length > 0) {
      const eduFields = [];
      resume.education.forEach(edu => {
        eduFields.push(
          { value: edu.degree, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3 },
          { value: edu.institutionName || edu.institution, validator: (val) => isMeaningfulContent(val) && val.trim().length >= 3 },
          { value: edu.startDate, validator: (val) => !!val }
        );
      });

      if (eduFields.length > 0) {
        sections.push({
          name: 'Education',
          weight: 15,
          fields: eduFields
        });
      }
    }

    if (resume.skills?.length > 0) {
      const skillFields = resume.skills.map(skill => ({
        value: skill.name,
        validator: (val) => isMeaningfulContent(val) && val.trim().length >= 2
      }));

      if (skillFields.length > 0) {
        sections.push({
          name: 'Skills',
          weight: 10,
          fields: skillFields
        });
      }
    }

    // Calculate completion
    let totalScore = 0;
    let totalWeight = 0;

    sections.forEach(section => {
      const validFields = section.fields.filter(field =>
        field.validator(field.value)
      ).length;

      const sectionCompletion = section.fields.length > 0 ?
        (validFields / section.fields.length) : 0;

      totalScore += sectionCompletion * section.weight;
      totalWeight += section.weight;
    });

    // Calculate final percentage
    const finalPercentage = totalWeight > 0 ?
      Math.round((totalScore / totalWeight) * 100) : 0;

    return Math.max(0, Math.min(100, finalPercentage));
  };

  const fetchAllResumes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_ALL);
      // Use saved completion percentage from database, fallback to calculation if not available
      const resumesWithCompletion = response.data.map((resume) => ({
        ...resume,
        completion: resume.completion !== undefined ? resume.completion : calculateCompletion(resume),
      }));
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort resumes
  const filteredAndSortedResumes = React.useMemo(() => {
    let filtered = allResumes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resume.profileInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resume.profileInfo?.designation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply completion filter
    if (filterBy !== "all") {
      filtered = filtered.filter(resume => {
        const completion = resume.completion !== undefined ? resume.completion : calculateCompletion(resume);
        if (filterBy === "completed") return completion >= 90;
        if (filterBy === "draft") return completion < 90;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "completion":
          const completionA = a.completion !== undefined ? a.completion : calculateCompletion(a);
          const completionB = b.completion !== undefined ? b.completion : calculateCompletion(b);
          return completionB - completionA;
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "updatedAt":
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return filtered;
  }, [allResumes, searchQuery, filterBy, sortBy]);

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUMES.DELETE(resumeToDelete));
      showSuccessToast("Resume deleted successfully");
      fetchAllResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      showErrorToast("Failed to delete resume. Please try again.");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

const handleDeleteClick = (resumeId) => {
  setResumeToDelete(resumeId);
  setShowDeleteConfirm(true);
};

const handleShareClick = (resume) => {
  setSelectedResumeForShare(resume);
  setShareModalOpen(true);
};

const handleCreateResume = () => {
  navigate("/ai-generator");
};

const handleUploadResume = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    showErrorToast('Please upload a PDF or Word document');
    return;
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showErrorToast('File size must be less than 10MB');
    return;
  }

  setIsUploadingResume(true);
  setUploadProgress(0);

  try {
    // Step 1: Upload file
    setUploadStep('Uploading file...');
    setUploadProgress(20);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: Extract text content
    setUploadStep('Analyzing document structure...');
    setUploadProgress(40);
    const extractedText = await extractTextFromFile(file);

    // Step 3: Parse content
    setUploadStep('Extracting personal information...');
    setUploadProgress(60);
    await new Promise(resolve => setTimeout(resolve, 300));

    setUploadStep('Processing work experience...');
    setUploadProgress(80);
    await new Promise(resolve => setTimeout(resolve, 300));

    setUploadStep('Finalizing resume data...');
    setUploadProgress(95);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Parse the extracted content into structured data
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const parsedData = parseResumeContent(extractedText, fileName);

    // Create resume data with extracted content
    const newResumeData = {
      ...parsedData,
      template: {
        id: "01",
        theme: "professional"
      }
    };

    // Calculate completion percentage based on actual content
    const calculatedCompletion = calculateCompletion(newResumeData);
    newResumeData.completion = calculatedCompletion;

    // Create resume in database
    const response = await axiosInstance.post(API_PATHS.RESUMES.CREATE, newResumeData);

    if (response.data) {
      // Handle different response structures from backend
      const resumeId = response.data.resumeId || response.data.resume?._id || response.data._id;

      if (resumeId) {
        setUploadProgress(100);
        setUploadStep('Complete! Redirecting...');

        showSuccessToast('🎉 Resume uploaded and parsed successfully! Redirecting to editor...');

        // Small delay to show completion
        setTimeout(() => {
          navigate(`/resumes/${resumeId}?uploaded=true`);
        }, 800);
      } else {
        console.error('No resume ID found in response:', response.data);
        showErrorToast('Resume created but ID not found. Please check your dashboard.');
        // Fallback: refresh the page to show the new resume
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } else {
      showErrorToast('Failed to create resume from upload.');
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to upload resume. Please try again.';
    showErrorToast(errorMessage);
  } finally {
    setIsUploadingResume(false);
    setUploadProgress(0);
    setUploadStep('');
    // Reset file input
    event.target.value = '';
  }
};


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-black text-gray-900 mb-2">My Resumes</h1>
            <p className="text-gray-600">
              Create and manage your professional resumes with ease
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span>{allResumes.length} total resumes</span>
              <span>•</span>
              <span>{filteredAndSortedResumes.length} showing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animate-delay-200">
            <EnhancedButton
              onClick={() => navigate("/ai-generator")}
              variant="primary"
              icon={Sparkles}
              className="shadow-lg hover:shadow-xl animate-pulse-glow"
            >
              AI Resume Generator
            </EnhancedButton>

            <div className="relative">
              <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer shadow-lg hover:shadow-xl min-w-[140px] ${
                isUploadingResume
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
              }`}>
                {isUploadingResume ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    {uploadStep && (
                      <div className="text-xs opacity-90 text-center">{uploadStep}</div>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Resume
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleUploadResume}
                  disabled={isUploadingResume}
                  className="hidden"
                />
              </label>

              {/* Progress bar */}
              {isUploadingResume && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <EnhancedButton
              onClick={() => setOpenCreateModal(true)}
              variant="outline"
              icon={Plus}
              className="shadow-lg hover:shadow-xl"
            >
              Create Manually
            </EnhancedButton>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 animate-fade-in-up animate-delay-300">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resumes by title, name, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="updatedAt">Last Updated</option>
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="completion">Completion</option>
                  </select>
                </div>

                {/* Filter By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="all">All Resumes</option>
                    <option value="completed">Completed (90%+)</option>
                    <option value="draft">Draft (&lt;90%)</option>
                  </select>
                </div>

                {/* Quick Actions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterBy("all");
                        setSortBy("updatedAt");
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* Empty space */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className="text-violet-600" />
            </div>
            <h3 className={styles.emptyTitle}>No Resumes Found</h3>
            <p className={styles.emptyText}>Start creating one!</p>
            <button onClick={() => setOpenCreateModal(true)} className={styles.createButton}>
  <div className={styles.createButtonOverlay}></div>
  <span className={styles.createButtonContent}>
    Create Your First Resume
    <LucideFilePlus className="group-hover:translate-x-1 transition-transform" size={20} />
  </span>
</button>

          </div>
        )}

        {/* Resume Grid/List */}
        {!loading && filteredAndSortedResumes.length > 0 && (
          <div className="animate-fade-in-up animate-delay-400">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Card */}
                <div
                  onClick={() => setOpenCreateModal(true)}
                  className="group cursor-pointer bg-gradient-to-br from-violet-50 to-fuchsia-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 hover:border-violet-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[280px]"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Create New Resume</h3>
                  <p className="text-gray-600 text-sm">Start building your professional resume</p>
                </div>

                {/* Resume Cards */}
                {filteredAndSortedResumes.map((resume, index) => (
                  <div
                    key={resume._id}
                    className="animate-fade-in-scale"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <ResumeSummaryCard
                      imgUrl={resume.thumbnailLink}
                      title={resume.title}
                      createdAt={resume.createdAt}
                      updatedAt={resume.updatedAt}
                      onSelect={() => navigate(`/resumes/${resume._id}`)}
                      onDelete={() => handleDeleteClick(resume._id)}
                      onShare={() => handleShareClick(resume)}
                      completion={resume.completion !== undefined ? resume.completion : calculateCompletion(resume)}
                      isPremium={resume.isPremium}
                      isNew={moment().diff(moment(resume.createdAt), "days") < 7}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredAndSortedResumes.map((resume, index) => (
                  <div
                    key={resume._id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {resume.thumbnailLink ? (
                            <img
                              src={resume.thumbnailLink}
                              alt={resume.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LucideFilePlus className="text-gray-400" size={20} />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{resume.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {resume.profileInfo?.fullName || "Untitled"} • {resume.profileInfo?.designation || "No role specified"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Updated {moment(resume.updatedAt).fromNow()}</span>
                            <span>•</span>
                            <span>{resume.completion !== undefined ? resume.completion : calculateCompletion(resume)}% complete</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/resumes/${resume._id}`)}
                          className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resume._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LucideTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader maxWidth="max-w-2xl">
        <div className="p-6">
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Create New Resume</h3>
          </div>
          <button className={styles.modalCloseButton} onClick={() => setOpenCreateModal(false)}>
            X
          </button>
        </div>
        <CreateResumeForm onSuccess={() => { setOpenCreateModal(false); fetchAllResumes(); }} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Resume"
        showActionBtn={true}
        actionBtnText="Delete Resume"
        actionBtnIcon={<LucideTrash2 size={16} />}
        onActionClick={handleDeleteResume}
        size="md"
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <LucideTrash2 className="text-red-600" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Resume</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this resume? This action cannot be undone and all your work will be permanently lost.
              </p>
            </div>
            <div className="flex gap-3 mt-6 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteResume}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <LucideTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Share Resume Modal */}
      <ShareResumeModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedResumeForShare(null);
        }}
        resumeId={selectedResumeForShare?._id}
        resumeTitle={selectedResumeForShare?.title}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
