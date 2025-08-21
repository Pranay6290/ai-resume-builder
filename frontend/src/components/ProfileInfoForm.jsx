import React, { useState } from "react";
import { Input } from "./Inputs";
import { profileInfoStyles } from "../assets/dummystyle";
import { Sparkles, Loader2, RefreshCw, Camera, Upload, X } from "lucide-react";

const ProfileInfoForm = ({ profileData, updateSection, currentTheme, resumeData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Check if current theme supports profile photo (TemplateFour)
  const supportsProfilePhoto = currentTheme === '04' || resumeData?.template?.theme === '04';

  const generateAISummary = async () => {
    if (!profileData.fullName || !profileData.designation) {
      alert("Please fill in your name and designation first to generate an AI summary.");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const name = profileData.fullName;
      const role = profileData.designation;

      // Enhanced AI summary generation based on role
      const summaryTemplates = {
        'software engineer': `Experienced Software Engineer with expertise in full-stack development and modern technologies. Proven track record of building scalable applications, optimizing system performance, and collaborating with cross-functional teams. Passionate about clean code, best practices, and delivering user-centric solutions that drive business growth.`,

        'frontend developer': `Creative Frontend Developer specializing in responsive web applications and user experience optimization. Proficient in modern JavaScript frameworks, CSS technologies, and design systems. Committed to creating intuitive, accessible, and performant web interfaces that enhance user engagement and satisfaction.`,

        'backend developer': `Skilled Backend Developer with strong experience in server-side technologies, database optimization, and API design. Expert in microservices architecture, cloud deployment, and system scalability. Focused on building robust, secure, and efficient backend systems that support business operations.`,

        'full stack developer': `Versatile Full Stack Developer with comprehensive experience in both frontend and backend technologies. Proven ability to deliver end-to-end solutions from concept to deployment. Strong problem-solving skills, passion for continuous learning, and expertise in modern development practices.`,

        'data scientist': `Analytical Data Scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in extracting actionable insights from complex datasets using Python, R, and various ML frameworks. Skilled in translating business requirements into data-driven solutions.`,

        'product manager': `Strategic Product Manager with proven experience in product lifecycle management and cross-functional team leadership. Expert in market research, user experience design, and agile methodologies. Focused on delivering products that drive business growth and customer satisfaction.`,

        'marketing manager': `Results-oriented Marketing Manager with expertise in digital marketing, brand management, and campaign optimization. Proven track record of increasing brand awareness, driving customer acquisition, and improving ROI through data-driven marketing strategies.`,

        'project manager': `Certified Project Manager with extensive experience in leading cross-functional teams and delivering complex projects on time and within budget. Expert in agile methodologies, risk management, and stakeholder communication. Committed to driving operational excellence.`,

        'designer': `Creative Designer with strong expertise in user interface design, user experience optimization, and visual communication. Proficient in design tools, prototyping, and design systems. Passionate about creating beautiful, functional, and user-centered designs that solve real problems.`,

        'qa engineer': `Detail-oriented QA Engineer with expertise in manual and automated testing methodologies. Experienced in test planning, execution, and defect management. Committed to ensuring software quality and reliability through comprehensive testing strategies.`,

        'devops engineer': `Experienced DevOps Engineer specializing in CI/CD pipelines, infrastructure automation, and cloud technologies. Expert in containerization, monitoring, and deployment strategies. Focused on improving development workflows and system reliability.`,

        'business analyst': `Analytical Business Analyst with strong experience in requirements gathering, process improvement, and stakeholder management. Skilled in translating business needs into technical solutions and driving organizational efficiency through data-driven insights.`,

        'default': `Results-driven ${role} with proven expertise in delivering high-impact solutions and driving organizational success. Demonstrated ability to combine technical skills with strategic thinking to achieve business objectives. Committed to continuous learning and professional excellence.`
      };

      // Find the best matching template
      const roleKey = role.toLowerCase();
      const templateKey = Object.keys(summaryTemplates).find(key =>
        key !== 'default' && (roleKey.includes(key) || key.includes(roleKey.split(' ')[0]))
      ) || 'default';

      const generatedSummary = summaryTemplates[templateKey];
      updateSection("summary", generatedSummary);

    } catch (error) {
      console.error('Error generating summary:', error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSummary = () => {
    updateSection("summary", "");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSection("profilePhoto", e.target.result);
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = () => {
    updateSection("profilePhoto", "");
  };

  return (
    <div className={profileInfoStyles.container}>
      <h2 className={profileInfoStyles.heading}>Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Start with your basic information. The AI can help generate a professional summary based on your name and role.
      </p>

      <div className="space-y-8">
        {/* Profile Photo Upload - Only for Professional Theme */}
        {supportsProfilePhoto && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} className="text-blue-600" />
              Professional Profile Photo
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a professional headshot to make your resume stand out. This feature is available for the Professional theme.
            </p>

            <div className="flex items-start gap-6">
              {/* Photo Preview */}
              <div className="flex-shrink-0">
                {profileData.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={profileData.profilePhoto}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                    isUploadingPhoto
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}>
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {profileData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>

                  {profileData.profilePhoto && (
                    <button
                      onClick={removePhoto}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <p>• Recommended: 400x400px or larger</p>
                  <p>• Formats: JPG, PNG, GIF (max 5MB)</p>
                  <p>• Professional headshot works best</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            placeholder="John Doe"
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
          />

          <Input
            label="Professional Title/Designation *"
            placeholder="Full Stack Developer"
            value={profileData.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
          />

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700">
                Professional Summary
              </label>
              <div className="flex gap-2">
                {profileData.summary && (
                  <button
                    onClick={clearSummary}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    title="Clear summary"
                  >
                    <RefreshCw size={14} />
                    Clear
                  </button>
                )}
                <button
                  onClick={generateAISummary}
                  disabled={isGenerating || !profileData.fullName || !profileData.designation}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isGenerating || !profileData.fullName || !profileData.designation
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate AI Summary
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              className={`${profileInfoStyles.textarea} ${isGenerating ? 'opacity-50' : ''}`}
              rows={5}
              placeholder="Write a brief professional summary about yourself, or use AI to generate one based on your name and designation..."
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
              disabled={isGenerating}
            />

            {!profileData.fullName || !profileData.designation ? (
              <p className="text-sm text-amber-600 mt-2">
                💡 Fill in your name and designation above to enable AI summary generation
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                ✨ AI can generate a professional summary tailored to your role
              </p>
            )}
          </div>
        </div>

        {/* Professional Summary Tips */}
        <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
          <h3 className="font-semibold text-violet-900 mb-2">💡 Professional Summary Tips</h3>
          <ul className="text-sm text-violet-800 space-y-1">
            <li>• Keep it concise (2-3 sentences, 50-100 words)</li>
            <li>• Highlight your key skills and experience</li>
            <li>• Mention your career goals or what you're seeking</li>
            <li>• Use action words and quantify achievements when possible</li>
            <li>• Tailor it to the specific role or industry you're targeting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
