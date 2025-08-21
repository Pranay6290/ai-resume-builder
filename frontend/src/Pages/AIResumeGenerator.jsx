import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, FileText, Zap, Brain, Target, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import EnhancedButton from '../components/EnhancedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import { showSuccessToast, showErrorToast } from '../components/NotificationSystem';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { generateResumeFromPrompt } from '../utils/aiResumeGenerator';

const AIResumeGenerator = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResumes, setGeneratedResumes] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationCount, setGenerationCount] = useState(0);

  const steps = [
    { id: 1, title: 'Describe Yourself', icon: Brain },
    { id: 2, title: 'AI Analysis', icon: Sparkles },
    { id: 3, title: 'Resume Generated', icon: CheckCircle }
  ];

  const samplePrompts = [
    "I'm Sarah Johnson, a senior software engineer with 6 years of experience in React, Node.js, Python, and AWS. I've worked at TechCorp and InnovateTech, leading teams of 5+ developers and building scalable web applications serving 100k+ users. I have a Computer Science degree from UC Berkeley with a 3.8 GPA. I'm passionate about AI, machine learning, and mentoring junior developers. I speak English and Spanish fluently. My email is sarah.johnson@email.com and I'm based in San Francisco, CA.",

    "I'm Michael Chen, a marketing manager with 4 years of experience in digital marketing, social media management, content creation, and data analytics. At Growth Marketing Co., I increased brand awareness by 200% and managed campaigns with budgets over $500k, generating $2M in revenue. I have an MBA from Stanford and I'm Google Analytics certified. I'm skilled in HubSpot, Salesforce, Adobe Creative Suite, and A/B testing. I enjoy photography and travel in my free time. Contact me at michael.chen@email.com, I'm located in New York, NY.",

    "I'm Emily Rodriguez, a recent graduate with a Bachelor's degree in Business Administration from Harvard University, magna cum laude with a 3.9 GPA. I've completed internships at Goldman Sachs in finance and McKinsey in consulting. I'm skilled in Excel, PowerPoint, Tableau, SQL, and data analysis. I led the university debate team and volunteered at local nonprofits. I'm fluent in English and Spanish, conversational in French. I'm looking for entry-level positions in business development or consulting. My email is emily.rodriguez@email.com and I'm based in Boston, MA.",

    "I'm David Kim, a UI/UX designer with 5 years of experience creating brand identities, web designs, mobile apps, and marketing materials. I'm proficient in Figma, Adobe Creative Suite, Sketch, and prototyping tools. At Creative Agency Ltd., I worked with clients ranging from startups to Fortune 500 companies, increasing user engagement by 40% through redesigned interfaces. I have a Bachelor of Fine Arts in Design from Art Institute. I'm passionate about user research, accessibility, and sustainable design. I enjoy hiking and cooking. Contact me at david.kim@email.com, based in Seattle, WA."
  ];

  const generateResume = async () => {
    if (!userInput.trim()) {
      showErrorToast('Please describe your background and experience');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(2);

    try {
      // Add variation to the prompt for different versions
      const enhancedInput = generationCount > 0
        ? `${userInput}\n\nGenerate a different variation focusing on ${getVariationFocus(generationCount)}.`
        : userInput;

      // Generate resume using AI service
      const generatedResumeData = await generateResumeFromPrompt(enhancedInput);

      // Create the resume in the database
      const response = await axiosInstance.post(API_PATHS.RESUMES.CREATE, generatedResumeData);

      const newResume = {
        id: response.data.resume?._id || response.data._id,
        data: generatedResumeData,
        timestamp: new Date().toISOString(),
        variation: getVariationName(generationCount)
      };

      setGeneratedResumes(prev => [newResume, ...prev]);
      setGenerationCount(prev => prev + 1);
      setCurrentStep(3);
      showSuccessToast(`Resume ${newResume.variation} generated successfully!`);

    } catch (error) {
      console.error('Error generating resume:', error);
      showErrorToast('Failed to generate resume. Please try again.');
      setCurrentStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  // Old parsing functions removed - now using advanced AI service

  // Helper functions for variation generation

  // All parsing functions moved to aiResumeGenerator.js service

  const editResume = (resumeId) => {
    navigate(`/resumes/${resumeId}`);
  };

  const getVariationFocus = (count) => {
    const focuses = [
      'technical skills and achievements',
      'leadership and management experience',
      'project outcomes and business impact',
      'education and certifications',
      'creative and innovative solutions'
    ];
    return focuses[count % focuses.length];
  };

  const getVariationName = (count) => {
    const names = [
      'Version 1 (Original)',
      'Version 2 (Technical Focus)',
      'Version 3 (Leadership Focus)',
      'Version 4 (Impact Focus)',
      'Version 5 (Academic Focus)',
      'Version 6 (Creative Focus)'
    ];
    return names[count] || `Version ${count + 1}`;
  };

  const generateAnother = () => {
    if (!userInput.trim()) {
      showErrorToast('Please enter your background information first');
      return;
    }
    generateResume();
  };

  const startOver = () => {
    setCurrentStep(1);
    setGeneratedResumes([]);
    setGenerationCount(0);
    setUserInput('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900">AI Resume Generator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Describe your background and let our AI create a professional resume tailored to your experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 animate-fade-in-up animate-delay-200">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon size={20} />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-violet-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="ml-8 text-gray-300" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-fade-in-up animate-delay-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Brain className="text-violet-600" size={24} />
              Tell Us About Yourself
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Describe your professional background, skills, and experience
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Example: I'm a software engineer with 5 years of experience in React and Node.js. I've worked at tech startups building scalable web applications..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all resize-none"
                  disabled={isGenerating}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {userInput.length}/1000 characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <EnhancedButton
                  onClick={generateResume}
                  variant="primary"
                  icon={isGenerating ? RefreshCw : Sparkles}
                  isLoading={isGenerating}
                  fullWidth
                  className="animate-pulse-glow"
                >
                  {isGenerating ? 'Generating Resume...' : 'Generate Resume with AI'}
                </EnhancedButton>
              </div>

              {generatedResumes.length > 0 && (
                <div className="flex gap-3">
                  <EnhancedButton
                    onClick={generateAnother}
                    variant="outline"
                    icon={RefreshCw}
                    className="flex-1"
                    disabled={isGenerating}
                  >
                    Generate Another Version
                  </EnhancedButton>
                  <EnhancedButton
                    onClick={startOver}
                    variant="ghost"
                    className="px-4"
                    disabled={isGenerating}
                  >
                    Start Over
                  </EnhancedButton>
                </div>
              )}
            </div>

            {/* Sample Prompts */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Need inspiration? Try these examples:</h3>
              <div className="space-y-3">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setUserInput(prompt)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                    disabled={isGenerating}
                  >
                    {prompt.substring(0, 100)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="animate-fade-in-up animate-delay-400">
            <AIAnalysisPanel
              userInput={userInput}
              onAnalysisComplete={(analysis) => {
                console.log('Analysis completed:', analysis);
              }}
            />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-fade-in-up animate-delay-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Target className="text-violet-600" size={24} />
              Generated Resumes
            </h2>

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" message="AI is analyzing your background..." type="resume" />
                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-2">Our AI is working on your resume...</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Zap size={16} />
                    <span>This usually takes 30-60 seconds</span>
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && generatedResumes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No resumes generated yet</h3>
                <p className="text-gray-600">
                  Describe your background above and click "Generate Resume with AI" to get started
                </p>
              </div>
            )}

            {generatedResumes.length > 0 && (
              <div className="space-y-4">
                {generatedResumes.map((resume, index) => (
                  <div key={resume.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {resume.variation || `Resume Version ${generatedResumes.length - index}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Generated {new Date(resume.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Ready
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Role:</strong> {resume.data.profileInfo.designation}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Summary:</strong> {resume.data.profileInfo.summary.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <EnhancedButton
                        onClick={() => editResume(resume.id)}
                        variant="primary"
                        icon={ArrowRight}
                        size="sm"
                      >
                        Edit & Customize
                      </EnhancedButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animate-delay-500">
          <div className="text-center">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="text-violet-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your input to extract key information and structure it professionally
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-violet-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Generation</h3>
            <p className="text-gray-600 text-sm">
              Get a complete, professional resume in under a minute with all sections filled
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-violet-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fully Customizable</h3>
            <p className="text-gray-600 text-sm">
              Edit, customize, and apply themes to make the generated resume uniquely yours
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIResumeGenerator;
