import React, { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Target, Zap, FileText, Search } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import LoadingSpinner from './LoadingSpinner';
import { showSuccessToast, showErrorToast } from './NotificationSystem';

const ATSScoreChecker = ({ resumeData, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResults, setAtsResults] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const analyzeATSCompatibility = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate ATS analysis process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const results = performATSAnalysis(resumeData, jobDescription);
      setAtsResults(results);
      
      showSuccessToast('ATS analysis completed!');
    } catch (error) {
      console.error('ATS analysis error:', error);
      showErrorToast('Failed to analyze ATS compatibility. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performATSAnalysis = (resume, jobDesc) => {
    const analysis = {
      overallScore: 0,
      categories: {},
      keywordMatches: [],
      recommendations: [],
      passedChecks: [],
      failedChecks: []
    };

    // Format Analysis
    const formatAnalysis = analyzeFormat(resume);
    analysis.categories.format = formatAnalysis;

    // Content Analysis
    const contentAnalysis = analyzeContent(resume);
    analysis.categories.content = contentAnalysis;

    // Keyword Analysis
    const keywordAnalysis = analyzeKeywords(resume, jobDesc);
    analysis.categories.keywords = keywordAnalysis;
    analysis.keywordMatches = keywordAnalysis.matches;

    // Structure Analysis
    const structureAnalysis = analyzeStructure(resume);
    analysis.categories.structure = structureAnalysis;

    // Calculate overall score
    analysis.overallScore = calculateATSScore(analysis.categories);

    // Generate recommendations
    analysis.recommendations = generateATSRecommendations(analysis.categories);

    // Compile passed/failed checks
    Object.values(analysis.categories).forEach(category => {
      analysis.passedChecks.push(...category.passed);
      analysis.failedChecks.push(...category.failed);
    });

    return analysis;
  };

  const analyzeFormat = (resume) => {
    const passed = [];
    const failed = [];
    let score = 0;

    // Check for standard sections
    if (resume.profileInfo?.fullName) {
      passed.push('Contact information present');
      score += 20;
    } else {
      failed.push('Missing contact information');
    }

    if (resume.workExperience?.length > 0) {
      passed.push('Work experience section included');
      score += 20;
    } else {
      failed.push('No work experience provided');
    }

    if (resume.skills?.length > 0) {
      passed.push('Skills section present');
      score += 15;
    } else {
      failed.push('Missing skills section');
    }

    if (resume.education?.length > 0) {
      passed.push('Education section included');
      score += 15;
    } else {
      failed.push('No education information');
    }

    // Check for proper formatting
    const hasProperDates = resume.workExperience?.every(exp => exp.startDate);
    if (hasProperDates) {
      passed.push('Consistent date formatting');
      score += 10;
    } else {
      failed.push('Inconsistent or missing dates');
    }

    return { score: Math.min(100, score), passed, failed };
  };

  const analyzeContent = (resume) => {
    const passed = [];
    const failed = [];
    let score = 0;

    // Check summary length
    const summaryLength = resume.profileInfo?.summary?.length || 0;
    if (summaryLength >= 50 && summaryLength <= 200) {
      passed.push('Professional summary is optimal length');
      score += 25;
    } else if (summaryLength > 0) {
      failed.push('Professional summary needs optimization');
      score += 10;
    } else {
      failed.push('Missing professional summary');
    }

    // Check for quantified achievements
    const workContent = resume.workExperience?.map(exp => 
      exp.responsibilities?.join(' ') || ''
    ).join(' ') || '';
    
    const hasNumbers = /\d+/.test(workContent);
    if (hasNumbers) {
      passed.push('Contains quantified achievements');
      score += 25;
    } else {
      failed.push('Lacks quantified achievements');
    }

    // Check for action verbs
    const strongVerbs = ['led', 'managed', 'developed', 'implemented', 'achieved', 'improved', 'created', 'optimized'];
    const hasStrongVerbs = strongVerbs.some(verb => 
      workContent.toLowerCase().includes(verb)
    );
    
    if (hasStrongVerbs) {
      passed.push('Uses strong action verbs');
      score += 25;
    } else {
      failed.push('Needs stronger action verbs');
    }

    // Check content length
    const totalWords = workContent.split(' ').length;
    if (totalWords >= 100 && totalWords <= 500) {
      passed.push('Appropriate content length');
      score += 25;
    } else {
      failed.push('Content length needs adjustment');
    }

    return { score: Math.min(100, score), passed, failed };
  };

  const analyzeKeywords = (resume, jobDesc) => {
    const passed = [];
    const failed = [];
    const matches = [];
    let score = 0;

    if (!jobDesc || jobDesc.trim().length === 0) {
      failed.push('No job description provided for keyword analysis');
      return { score: 0, passed, failed, matches };
    }

    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDesc);
    const resumeText = extractResumeText(resume);

    // Enhanced keyword matching with fuzzy matching and synonyms
    const resumeTextLower = resumeText.toLowerCase();

    jobKeywords.forEach(keyword => {
      let matchCount = 0;
      let matched = false;
      const keywordLower = keyword.toLowerCase();

      // Direct exact match
      const exactRegex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const exactMatches = (resumeText.match(exactRegex) || []).length;
      matchCount += exactMatches;

      // Fuzzy matching for common variations
      const variations = [
        keywordLower.replace(/\./g, ''), // react.js -> reactjs
        keywordLower.replace(/\s+/g, ''), // react js -> reactjs
        keywordLower.replace(/-/g, ''), // front-end -> frontend
        keywordLower.replace(/js$/i, ''), // reactjs -> react
        keywordLower + 'js', // react -> reactjs
        keywordLower.replace(/\.js$/i, '.js'), // ensure .js ending
      ];

      variations.forEach(variation => {
        if (variation !== keywordLower && variation.length > 2) {
          const varRegex = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          const varMatches = (resumeText.match(varRegex) || []).length;
          matchCount += varMatches;
        }
      });

      // Context-aware matching for tech stacks
      const contextMatches = getContextualMatches(keywordLower, resumeTextLower);
      matchCount += contextMatches;

      matched = matchCount > 0;

      matches.push({
        keyword,
        count: matchCount,
        matched,
        matchType: exactMatches > 0 ? 'exact' : (matchCount > 0 ? 'contextual' : 'none')
      });
    });

    const matchedCount = matches.filter(m => m.matched).length;
    const matchPercentage = (matchedCount / jobKeywords.length) * 100;

    if (matchPercentage >= 70) {
      passed.push(`Excellent keyword match (${Math.round(matchPercentage)}%)`);
      score = 100;
    } else if (matchPercentage >= 50) {
      passed.push(`Good keyword match (${Math.round(matchPercentage)}%)`);
      score = 75;
    } else if (matchPercentage >= 30) {
      failed.push(`Moderate keyword match (${Math.round(matchPercentage)}%)`);
      score = 50;
    } else {
      failed.push(`Low keyword match (${Math.round(matchPercentage)}%)`);
      score = 25;
    }

    return { score, passed, failed, matches };
  };

  const analyzeStructure = (resume) => {
    const passed = [];
    const failed = [];
    let score = 0;

    // Check section order
    const hasLogicalOrder = resume.profileInfo && resume.contactInfo;
    if (hasLogicalOrder) {
      passed.push('Logical section ordering');
      score += 25;
    } else {
      failed.push('Improve section organization');
    }

    // Check for consistent formatting
    const workExperience = resume.workExperience || [];
    const hasConsistentWork = workExperience.every(exp => 
      exp.jobTitle && exp.companyName && exp.startDate
    );
    
    if (hasConsistentWork && workExperience.length > 0) {
      passed.push('Consistent work experience formatting');
      score += 25;
    } else if (workExperience.length > 0) {
      failed.push('Inconsistent work experience formatting');
    }

    // Check skills organization
    const skills = resume.skills || [];
    if (skills.length >= 5) {
      passed.push('Adequate skills listed');
      score += 25;
    } else {
      failed.push('Add more relevant skills');
    }

    // Check for completeness
    const completionScore = calculateCompletionScore(resume);
    if (completionScore >= 80) {
      passed.push('Resume is well-completed');
      score += 25;
    } else {
      failed.push('Resume needs more complete information');
    }

    return { score: Math.min(100, score), passed, failed };
  };

  const extractKeywords = (jobDesc) => {
    // Enhanced keyword extraction with tech stack awareness
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'must', 'shall', 'this', 'that', 'these', 'those', 'we', 'you', 'they', 'them', 'our', 'your', 'their'];

    // Tech stack synonyms and related terms
    const techStackMap = {
      // Frontend Technologies
      'react': ['reactjs', 'react.js', 'react js', 'frontend', 'front-end', 'ui', 'user interface'],
      'vue': ['vuejs', 'vue.js', 'vue js', 'frontend', 'front-end'],
      'angular': ['angularjs', 'angular.js', 'frontend', 'front-end', 'typescript'],
      'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'frontend', 'web development'],
      'typescript': ['ts', 'javascript', 'js', 'frontend', 'type safety'],
      'html': ['html5', 'markup', 'frontend', 'web development'],
      'css': ['css3', 'styling', 'sass', 'scss', 'less', 'frontend'],
      'tailwind': ['tailwindcss', 'css framework', 'utility-first'],
      'bootstrap': ['css framework', 'responsive design'],

      // Backend Technologies
      'node': ['nodejs', 'node.js', 'backend', 'server-side', 'javascript'],
      'express': ['expressjs', 'express.js', 'node', 'backend', 'api'],
      'python': ['backend', 'server-side', 'django', 'flask', 'fastapi'],
      'java': ['backend', 'spring', 'spring boot', 'enterprise'],
      'php': ['backend', 'laravel', 'symfony', 'server-side'],
      'ruby': ['ruby on rails', 'rails', 'backend'],
      'go': ['golang', 'backend', 'microservices'],
      'rust': ['backend', 'systems programming'],

      // Databases
      'mongodb': ['mongo', 'nosql', 'database', 'document database'],
      'mysql': ['sql', 'relational database', 'database'],
      'postgresql': ['postgres', 'sql', 'relational database', 'database'],
      'redis': ['cache', 'in-memory database', 'nosql'],
      'elasticsearch': ['search engine', 'full-text search'],

      // Cloud & DevOps
      'aws': ['amazon web services', 'cloud', 'ec2', 's3', 'lambda'],
      'azure': ['microsoft azure', 'cloud'],
      'gcp': ['google cloud', 'cloud'],
      'docker': ['containerization', 'containers', 'devops'],
      'kubernetes': ['k8s', 'container orchestration', 'devops'],
      'jenkins': ['ci/cd', 'continuous integration', 'devops'],
      'git': ['version control', 'github', 'gitlab', 'bitbucket'],

      // Mobile Development
      'react native': ['mobile development', 'cross-platform', 'ios', 'android'],
      'flutter': ['mobile development', 'cross-platform', 'dart'],
      'swift': ['ios development', 'mobile development'],
      'kotlin': ['android development', 'mobile development'],

      // Data & Analytics
      'machine learning': ['ml', 'ai', 'artificial intelligence', 'data science'],
      'tensorflow': ['ml', 'machine learning', 'deep learning'],
      'pytorch': ['ml', 'machine learning', 'deep learning'],
      'pandas': ['data analysis', 'python', 'data science'],
      'numpy': ['data analysis', 'python', 'scientific computing'],

      // General Skills
      'agile': ['scrum', 'kanban', 'project management'],
      'api': ['rest', 'restful', 'graphql', 'web services'],
      'testing': ['unit testing', 'integration testing', 'qa', 'quality assurance'],
      'microservices': ['distributed systems', 'architecture', 'scalability']
    };

    // Extract words and phrases
    const words = jobDesc.toLowerCase()
      .replace(/[^\w\s.-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));

    // Also extract common tech phrases (2-3 words)
    const phrases = [];
    const sentences = jobDesc.toLowerCase().split(/[.!?]+/);
    sentences.forEach(sentence => {
      const phraseMatches = sentence.match(/\b(?:react\.?js|vue\.?js|angular\.?js|node\.?js|express\.?js|spring boot|machine learning|data science|full[- ]?stack|front[- ]?end|back[- ]?end|web development|software development|ci\/cd|devops|quality assurance)\b/g);
      if (phraseMatches) {
        phrases.push(...phraseMatches);
      }
    });

    // Combine words and phrases
    const allTerms = [...words, ...phrases];

    // Get unique terms and sort by frequency
    const termCount = {};
    allTerms.forEach(term => {
      termCount[term] = (termCount[term] || 0) + 1;
    });

    // Get base keywords
    const baseKeywords = Object.keys(termCount)
      .sort((a, b) => termCount[b] - termCount[a])
      .slice(0, 30);

    // Expand with synonyms and related terms
    const expandedKeywords = new Set(baseKeywords);

    baseKeywords.forEach(keyword => {
      const normalizedKeyword = keyword.replace(/[.-]/g, '').toLowerCase();

      // Check if this keyword has synonyms/related terms
      Object.entries(techStackMap).forEach(([tech, synonyms]) => {
        if (normalizedKeyword.includes(tech) || tech.includes(normalizedKeyword) ||
            synonyms.some(syn => normalizedKeyword.includes(syn) || syn.includes(normalizedKeyword))) {
          expandedKeywords.add(tech);
          synonyms.forEach(syn => expandedKeywords.add(syn));
        }
      });
    });

    return Array.from(expandedKeywords).slice(0, 40); // Return top 40 expanded keywords
  };

  const getContextualMatches = (keyword, resumeText) => {
    let contextMatches = 0;

    // Define contextual relationships
    const contextualMappings = {
      'frontend': ['ui', 'user interface', 'web development', 'client-side', 'browser'],
      'backend': ['server', 'api', 'database', 'server-side'],
      'fullstack': ['full stack', 'end-to-end', 'frontend', 'backend'],
      'react': ['jsx', 'component', 'hooks', 'virtual dom', 'spa'],
      'node': ['npm', 'express', 'javascript runtime', 'v8'],
      'python': ['pip', 'django', 'flask', 'pandas', 'numpy'],
      'javascript': ['dom', 'ajax', 'json', 'es6', 'async'],
      'database': ['sql', 'nosql', 'crud', 'schema', 'query'],
      'api': ['rest', 'endpoint', 'json', 'http', 'request'],
      'testing': ['unit test', 'integration', 'jest', 'mocha', 'cypress'],
      'devops': ['deployment', 'pipeline', 'automation', 'monitoring'],
      'agile': ['sprint', 'scrum master', 'standup', 'retrospective'],
      'cloud': ['deployment', 'scalability', 'infrastructure', 'serverless'],
      'mobile': ['ios', 'android', 'app store', 'responsive'],
      'machine learning': ['algorithm', 'model', 'training', 'prediction', 'dataset'],
      'data science': ['analysis', 'visualization', 'statistics', 'insights']
    };

    // Check for contextual matches
    const contexts = contextualMappings[keyword] || [];
    contexts.forEach(context => {
      const contextRegex = new RegExp(`\\b${context.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const contextCount = (resumeText.match(contextRegex) || []).length;
      contextMatches += contextCount * 0.5; // Weight contextual matches less than direct matches
    });

    // Special case: if looking for a framework, check for related project descriptions
    if (['react', 'vue', 'angular', 'node', 'express', 'django', 'flask'].includes(keyword)) {
      const projectIndicators = ['built', 'developed', 'created', 'implemented', 'project', 'application', 'website'];
      projectIndicators.forEach(indicator => {
        const projectRegex = new RegExp(`${indicator}.*${keyword}|${keyword}.*${indicator}`, 'gi');
        if (projectRegex.test(resumeText)) {
          contextMatches += 0.3;
        }
      });
    }

    return Math.floor(contextMatches);
  };

  const extractResumeText = (resume) => {
    let text = '';
    
    if (resume.profileInfo) {
      text += `${resume.profileInfo.fullName || ''} ${resume.profileInfo.designation || ''} ${resume.profileInfo.summary || ''} `;
    }
    
    if (resume.workExperience) {
      resume.workExperience.forEach(exp => {
        text += `${exp.jobTitle || ''} ${exp.companyName || ''} ${exp.responsibilities?.join(' ') || ''} `;
      });
    }
    
    if (resume.skills) {
      text += resume.skills.map(skill => skill.name).join(' ') + ' ';
    }
    
    if (resume.education) {
      resume.education.forEach(edu => {
        text += `${edu.degree || ''} ${edu.institution || ''} `;
      });
    }
    
    return text.toLowerCase();
  };

  const calculateCompletionScore = (resume) => {
    let score = 0;
    let maxScore = 0;

    // Profile info (30 points)
    maxScore += 30;
    if (resume.profileInfo?.fullName) score += 10;
    if (resume.profileInfo?.designation) score += 10;
    if (resume.profileInfo?.summary) score += 10;

    // Contact info (20 points)
    maxScore += 20;
    if (resume.contactInfo?.email) score += 10;
    if (resume.contactInfo?.phone) score += 10;

    // Work experience (30 points)
    maxScore += 30;
    if (resume.workExperience?.length > 0) score += 30;

    // Skills (10 points)
    maxScore += 10;
    if (resume.skills?.length > 0) score += 10;

    // Education (10 points)
    maxScore += 10;
    if (resume.education?.length > 0) score += 10;

    return Math.round((score / maxScore) * 100);
  };

  const calculateATSScore = (categories) => {
    const weights = {
      format: 0.3,
      content: 0.3,
      keywords: 0.25,
      structure: 0.15
    };

    let totalScore = 0;
    Object.entries(categories).forEach(([category, data]) => {
      totalScore += data.score * weights[category];
    });

    return Math.round(totalScore);
  };

  const generateATSRecommendations = (categories) => {
    const recommendations = [];

    Object.entries(categories).forEach(([category, data]) => {
      if (data.score < 70) {
        data.failed.forEach(issue => {
          recommendations.push({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            issue,
            priority: data.score < 50 ? 'high' : 'medium'
          });
        });
      }
    });

    return recommendations;
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
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">ATS Compatibility Checker</h2>
        <p className="text-gray-600">
          Analyze how well your resume performs with Applicant Tracking Systems
        </p>
      </div>

      {!atsResults && !isAnalyzing && (
        <div className="space-y-6">
          {/* Job Description Input */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Job Description (Optional)</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Paste the job description to get keyword matching analysis and improve your ATS score.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for better keyword analysis..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            />
          </div>

          {/* Analysis Features */}
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-8">
            <Target className="mx-auto text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">ATS Analysis Includes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Format compatibility check</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Keyword matching analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Content structure review</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">ATS-friendly recommendations</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <EnhancedButton
              onClick={analyzeATSCompatibility}
              variant="primary"
              icon={Search}
              size="lg"
              className="animate-pulse-glow"
            >
              Analyze ATS Compatibility
            </EnhancedButton>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" message="Analyzing ATS compatibility..." type="resume" />
          <div className="mt-6">
            <p className="text-gray-600 mb-4">Checking format, keywords, and structure...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>Running comprehensive ATS analysis</span>
            </div>
          </div>
        </div>
      )}

      {atsResults && (
        <div className="space-y-6">
          {/* Overall ATS Score */}
          <div className={`${getScoreBgColor(atsResults.overallScore)} rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h3>
                <p className="text-gray-600">How likely your resume is to pass ATS screening</p>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-black ${getScoreColor(atsResults.overallScore)}`}>
                  {atsResults.overallScore}
                </div>
                <div className="text-sm text-gray-600">out of 100</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(atsResults.categories).map(([category, data]) => (
              <div key={category} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900 capitalize">{category}</h4>
                  <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                    {data.score}
                  </div>
                </div>
                
                {data.passed.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-green-700 mb-2">✓ Passed Checks</h5>
                    <div className="space-y-1">
                      {data.passed.map((check, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={14} />
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {data.failed.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-red-700 mb-2">⚠ Issues Found</h5>
                    <div className="space-y-1">
                      {data.failed.map((issue, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <AlertTriangle className="text-red-500" size={14} />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Keyword Matches */}
          {atsResults.keywordMatches.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Keyword Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {atsResults.keywordMatches.slice(0, 15).map((match, index) => (
                  <div key={index} className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    match.matched
                      ? match.matchType === 'exact'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-red-100 text-red-700 border-red-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{match.keyword}</span>
                      {match.matched && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">({match.count})</span>
                          {match.matchType === 'exact' && (
                            <span className="text-xs bg-green-200 text-green-800 px-1 rounded">exact</span>
                          )}
                          {match.matchType === 'contextual' && (
                            <span className="text-xs bg-blue-200 text-blue-800 px-1 rounded">context</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Exact Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span>Contextual Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span>No Match</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {atsResults.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
              </div>
              <div className="space-y-4">
                {atsResults.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{rec.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-600">{rec.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <EnhancedButton
              onClick={() => analyzeATSCompatibility()}
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

export default ATSScoreChecker;
