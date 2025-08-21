import React, { useState } from 'react';
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Lightbulb, Target, Zap, Star } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import LoadingSpinner from './LoadingSpinner';
import { showSuccessToast, showErrorToast } from './NotificationSystem';

const ResumeOptimizer = ({ resumeData, onOptimizedResume, onClose }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [selectedOptimizations, setSelectedOptimizations] = useState([]);

  const optimizeResume = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results = analyzeAndOptimizeResume(resumeData);
      setOptimizationResults(results);
      
      showSuccessToast('Resume analysis completed!');
    } catch (error) {
      console.error('Optimization error:', error);
      showErrorToast('Failed to optimize resume. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const analyzeAndOptimizeResume = (resume) => {
    const analysis = {
      overallScore: 0,
      improvements: [],
      strengths: [],
      optimizedSections: {}
    };

    // Analyze Profile Info
    if (resume.profileInfo) {
      const profileAnalysis = analyzeProfileInfo(resume.profileInfo);
      analysis.improvements.push(...profileAnalysis.improvements);
      analysis.strengths.push(...profileAnalysis.strengths);
      analysis.optimizedSections.profileInfo = profileAnalysis.optimized;
    }

    // Analyze Work Experience
    if (resume.workExperience?.length > 0) {
      const workAnalysis = analyzeWorkExperience(resume.workExperience);
      analysis.improvements.push(...workAnalysis.improvements);
      analysis.strengths.push(...workAnalysis.strengths);
      analysis.optimizedSections.workExperience = workAnalysis.optimized;
    }

    // Analyze Skills
    if (resume.skills?.length > 0) {
      const skillsAnalysis = analyzeSkills(resume.skills);
      analysis.improvements.push(...skillsAnalysis.improvements);
      analysis.strengths.push(...skillsAnalysis.strengths);
      analysis.optimizedSections.skills = skillsAnalysis.optimized;
    }

    // Calculate overall score
    analysis.overallScore = calculateOverallScore(analysis);

    return analysis;
  };

  const analyzeProfileInfo = (profileInfo) => {
    const improvements = [];
    const strengths = [];
    const optimized = { ...profileInfo };

    // Analyze summary
    if (!profileInfo.summary || profileInfo.summary.length < 50) {
      improvements.push({
        type: 'summary',
        priority: 'high',
        title: 'Enhance Professional Summary',
        description: 'Your summary should be 2-3 sentences highlighting your key achievements and value proposition.',
        suggestion: 'Results-driven professional with [X] years of experience in [field]. Proven track record of [specific achievement]. Seeking to leverage expertise in [skills] to drive success at [company type].'
      });
      
      optimized.summary = generateOptimizedSummary(profileInfo);
    } else {
      strengths.push('Strong professional summary that clearly communicates value');
    }

    // Analyze designation
    if (profileInfo.designation && profileInfo.designation.length > 5) {
      strengths.push('Clear professional title specified');
    } else {
      improvements.push({
        type: 'designation',
        priority: 'medium',
        title: 'Specify Professional Title',
        description: 'Add a clear, industry-standard job title that matches your target role.',
        suggestion: 'Use titles like "Senior Software Engineer", "Marketing Manager", or "Data Analyst"'
      });
    }

    return { improvements, strengths, optimized };
  };

  const analyzeWorkExperience = (workExperience) => {
    const improvements = [];
    const strengths = [];
    const optimized = workExperience.map(exp => ({ ...exp }));

    workExperience.forEach((exp, index) => {
      // Check for quantified achievements
      const hasNumbers = /\d+/.test(exp.responsibilities?.join(' ') || '');
      if (!hasNumbers) {
        improvements.push({
          type: 'quantification',
          priority: 'high',
          title: `Quantify Achievements - ${exp.jobTitle}`,
          description: 'Add specific numbers, percentages, or metrics to demonstrate impact.',
          suggestion: 'Instead of "Improved sales", write "Increased sales by 25% over 6 months"'
        });

        // Generate optimized responsibilities
        optimized[index].responsibilities = optimizeResponsibilities(exp.responsibilities || []);
      } else {
        strengths.push(`Quantified achievements in ${exp.jobTitle} role`);
      }

      // Check for action verbs
      const responsibilities = exp.responsibilities?.join(' ').toLowerCase() || '';
      const weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted'];
      const hasWeakVerbs = weakVerbs.some(verb => responsibilities.includes(verb));
      
      if (hasWeakVerbs) {
        improvements.push({
          type: 'action_verbs',
          priority: 'medium',
          title: `Use Strong Action Verbs - ${exp.jobTitle}`,
          description: 'Replace weak phrases with powerful action verbs.',
          suggestion: 'Use verbs like "Led", "Implemented", "Achieved", "Optimized", "Developed"'
        });
      }
    });

    return { improvements, strengths, optimized };
  };

  const analyzeSkills = (skills) => {
    const improvements = [];
    const strengths = [];
    const optimized = [...skills];

    if (skills.length < 8) {
      improvements.push({
        type: 'skills_quantity',
        priority: 'medium',
        title: 'Expand Skills Section',
        description: 'Add more relevant technical and soft skills to showcase your expertise.',
        suggestion: 'Include 8-12 skills relevant to your target role, including both technical and soft skills.'
      });
    } else {
      strengths.push('Comprehensive skills section with good variety');
    }

    // Check for skill categories
    const hasCategories = skills.some(skill => skill.category);
    if (!hasCategories && skills.length > 6) {
      improvements.push({
        type: 'skills_organization',
        priority: 'low',
        title: 'Organize Skills by Category',
        description: 'Group skills into categories like "Technical", "Languages", "Tools" for better readability.',
        suggestion: 'Categorize skills to make them easier to scan for recruiters and ATS systems.'
      });
    }

    return { improvements, strengths, optimized };
  };

  const generateOptimizedSummary = (profileInfo) => {
    const role = profileInfo.designation || 'Professional';
    const name = profileInfo.fullName || 'Professional';

    // Create role-specific summaries
    const roleTemplates = {
      'software engineer': `Experienced Software Engineer with expertise in full-stack development and modern technologies. Proven track record of building scalable applications and optimizing system performance. Passionate about clean code, best practices, and delivering user-centric solutions.`,
      'frontend developer': `Creative Frontend Developer specializing in responsive web applications and user experience optimization. Proficient in modern JavaScript frameworks and CSS technologies. Committed to creating intuitive, accessible, and performant web interfaces.`,
      'backend developer': `Skilled Backend Developer with strong experience in server-side technologies and database optimization. Expert in API design, microservices architecture, and cloud deployment. Focused on building robust, scalable, and secure backend systems.`,
      'full stack developer': `Versatile Full Stack Developer with comprehensive experience in both frontend and backend technologies. Proven ability to deliver end-to-end solutions from concept to deployment. Strong problem-solving skills and passion for continuous learning.`,
      'data scientist': `Analytical Data Scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in extracting actionable insights from complex datasets. Skilled in Python, R, and various ML frameworks.`,
      'product manager': `Strategic Product Manager with proven experience in product lifecycle management and cross-functional team leadership. Expert in market research, user experience design, and agile methodologies. Focused on delivering products that drive business growth.`,
      'marketing manager': `Results-oriented Marketing Manager with expertise in digital marketing, brand management, and campaign optimization. Proven track record of increasing brand awareness and driving customer acquisition. Data-driven approach to marketing strategy.`,
      'project manager': `Certified Project Manager with extensive experience in leading cross-functional teams and delivering complex projects on time and within budget. Expert in agile methodologies, risk management, and stakeholder communication.`,
      'designer': `Creative Designer with strong expertise in user interface design, user experience optimization, and visual communication. Proficient in design tools and prototyping. Passionate about creating beautiful, functional, and user-centered designs.`,
      'default': `Results-driven ${role} with proven expertise in delivering high-impact solutions. Demonstrated ability to drive growth and efficiency through innovative approaches and strategic thinking. Seeking to leverage strong analytical and leadership skills to contribute to organizational success.`
    };

    // Find matching template
    const roleKey = role.toLowerCase();
    const template = Object.keys(roleTemplates).find(key =>
      roleKey.includes(key) || key.includes(roleKey.split(' ')[0])
    ) || 'default';

    return roleTemplates[template];
  };

  const optimizeResponsibilities = (responsibilities, jobTitle = '') => {
    const actionVerbs = {
      'software': ['Developed', 'Implemented', 'Architected', 'Optimized', 'Debugged', 'Deployed', 'Integrated', 'Refactored'],
      'frontend': ['Designed', 'Implemented', 'Optimized', 'Created', 'Enhanced', 'Developed', 'Built', 'Improved'],
      'backend': ['Architected', 'Developed', 'Implemented', 'Optimized', 'Integrated', 'Deployed', 'Managed', 'Scaled'],
      'manager': ['Led', 'Managed', 'Coordinated', 'Directed', 'Supervised', 'Organized', 'Facilitated', 'Oversaw'],
      'analyst': ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched', 'Identified', 'Optimized', 'Improved'],
      'designer': ['Designed', 'Created', 'Conceptualized', 'Prototyped', 'Collaborated', 'Enhanced', 'Developed', 'Crafted'],
      'default': ['Led', 'Implemented', 'Achieved', 'Optimized', 'Developed', 'Managed', 'Created', 'Improved']
    };

    // Determine appropriate action verbs based on job title
    const titleKey = Object.keys(actionVerbs).find(key =>
      jobTitle.toLowerCase().includes(key)
    ) || 'default';
    const relevantVerbs = actionVerbs[titleKey];

    return responsibilities.map(resp => {
      let optimized = resp;

      // Replace weak phrases
      const weakPhrases = {
        'responsible for': relevantVerbs[Math.floor(Math.random() * relevantVerbs.length)],
        'worked on': relevantVerbs[Math.floor(Math.random() * relevantVerbs.length)],
        'helped with': 'Contributed to',
        'assisted in': 'Supported',
        'was involved in': 'Participated in',
        'took part in': 'Engaged in'
      };

      Object.entries(weakPhrases).forEach(([weak, strong]) => {
        const regex = new RegExp(weak, 'gi');
        optimized = optimized.replace(regex, strong);
      });

      // Add quantification suggestions if missing numbers
      if (!/\d+/.test(optimized) && optimized.length > 20) {
        const quantifiers = ['25%', '3+', '50+', '10x', '2 weeks', '5 projects', '$100K+', '15 team members'];
        const randomQuantifier = quantifiers[Math.floor(Math.random() * quantifiers.length)];

        // Insert quantifier contextually
        if (optimized.toLowerCase().includes('improve')) {
          optimized = optimized.replace(/improved?/gi, `Improved by ${randomQuantifier}`);
        } else if (optimized.toLowerCase().includes('manage')) {
          optimized = optimized.replace(/managed?/gi, `Managed ${randomQuantifier}`);
        } else if (optimized.toLowerCase().includes('develop')) {
          optimized = optimized.replace(/developed?/gi, `Developed ${randomQuantifier}`);
        }
      }

      return optimized;
    });
  };

  const calculateOverallScore = (analysis) => {
    const totalImprovements = analysis.improvements.length;
    const highPriorityCount = analysis.improvements.filter(imp => imp.priority === 'high').length;
    const strengthsCount = analysis.strengths.length;
    
    // Base score calculation
    let score = 70; // Starting score
    score -= (highPriorityCount * 10); // -10 for each high priority issue
    score -= (totalImprovements * 3); // -3 for each improvement needed
    score += (strengthsCount * 5); // +5 for each strength
    
    return Math.max(0, Math.min(100, score));
  };

  const applyOptimizations = () => {
    if (!optimizationResults) return;

    const optimizedResume = {
      ...resumeData,
      ...optimizationResults.optimizedSections
    };

    onOptimizedResume(optimizedResume);
    showSuccessToast('Resume optimizations applied successfully!');
    onClose();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">AI Resume Optimizer</h2>
        <p className="text-gray-600">
          Get AI-powered suggestions to make your resume more professional and ATS-friendly
        </p>
      </div>

      {!optimizationResults && !isOptimizing && (
        <div className="text-center">
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-8 mb-6">
            <Target className="mx-auto text-violet-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Optimize Your Resume?</h3>
            <p className="text-gray-600 mb-6">
              Our AI will analyze your resume and provide personalized recommendations to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Improve ATS compatibility</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Enhance professional language</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Quantify achievements</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Optimize keyword usage</span>
              </div>
            </div>
          </div>
          
          <EnhancedButton
            onClick={optimizeResume}
            variant="primary"
            icon={Zap}
            size="lg"
            className="animate-pulse-glow"
          >
            Analyze & Optimize Resume
          </EnhancedButton>
        </div>
      )}

      {isOptimizing && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" message="AI is analyzing your resume..." type="resume" />
          <div className="mt-6">
            <p className="text-gray-600 mb-4">This may take a few moments...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles size={16} />
              <span>Analyzing content structure and language</span>
            </div>
          </div>
        </div>
      )}

      {optimizationResults && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`${getScoreBgColor(optimizationResults.overallScore)} rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Optimization Score</h3>
                <p className="text-gray-600">Based on industry best practices and ATS compatibility</p>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-black ${getScoreColor(optimizationResults.overallScore)}`}>
                  {optimizationResults.overallScore}
                </div>
                <div className="text-sm text-gray-600">out of 100</div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {optimizationResults.strengths.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
              </div>
              <div className="space-y-2">
                {optimizationResults.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {optimizationResults.improvements.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="text-yellow-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Recommended Improvements</h3>
              </div>
              <div className="space-y-4">
                {optimizationResults.improvements.map((improvement, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        improvement.priority === 'high' ? 'bg-red-500' :
                        improvement.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{improvement.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            improvement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {improvement.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{improvement.description}</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Suggestion:</strong> {improvement.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton
              onClick={applyOptimizations}
              variant="primary"
              icon={CheckCircle}
              size="lg"
            >
              Apply All Optimizations
            </EnhancedButton>
            <EnhancedButton
              onClick={() => optimizeResume()}
              variant="outline"
              icon={TrendingUp}
              size="lg"
            >
              Re-analyze Resume
            </EnhancedButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeOptimizer;
