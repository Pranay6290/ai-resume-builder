import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, CheckCircle, AlertCircle, Lightbulb, Star } from 'lucide-react';
import EnhancedButton from './EnhancedButton';

const AIAnalysisPanel = ({ userInput, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (userInput && userInput.length > 50) {
      performAnalysis(userInput);
    }
  }, [userInput]);

  const performAnalysis = async (input) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResult = analyzeUserInput(input);
    setAnalysis(analysisResult);
    setIsAnalyzing(false);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const analyzeUserInput = (input) => {
    const words = input.toLowerCase();
    const sentences = input.split('.').filter(s => s.trim().length > 5);
    
    // Analyze different aspects
    const experienceLevel = analyzeExperienceLevel(words);
    const skillsDetected = analyzeSkills(words);
    const industryFocus = analyzeIndustry(words);
    const strengthsWeaknesses = analyzeStrengthsWeaknesses(input);
    const suggestions = generateSuggestions(words, experienceLevel);
    
    return {
      experienceLevel,
      skillsDetected,
      industryFocus,
      strengthsWeaknesses,
      suggestions,
      completenessScore: calculateCompletenessScore(input),
      professionalScore: calculateProfessionalScore(input),
      keywordDensity: analyzeKeywordDensity(words)
    };
  };

  const analyzeExperienceLevel = (words) => {
    const yearMatches = words.match(/(\d+)\s*years?/g);
    let totalYears = 0;
    
    if (yearMatches) {
      yearMatches.forEach(match => {
        const years = parseInt(match.match(/\d+/)[0]);
        totalYears = Math.max(totalYears, years);
      });
    }

    if (totalYears === 0) {
      if (words.includes('graduate') || words.includes('student') || words.includes('entry')) {
        return { level: 'Entry Level', years: 0, description: 'Recent graduate or entry-level professional' };
      }
    }

    if (totalYears <= 2) {
      return { level: 'Junior', years: totalYears, description: 'Early career professional with foundational experience' };
    } else if (totalYears <= 5) {
      return { level: 'Mid-Level', years: totalYears, description: 'Experienced professional with proven track record' };
    } else if (totalYears <= 10) {
      return { level: 'Senior', years: totalYears, description: 'Senior professional with extensive expertise' };
    } else {
      return { level: 'Executive', years: totalYears, description: 'Executive-level professional with leadership experience' };
    }
  };

  const analyzeSkills = (words) => {
    const skillCategories = {
      technical: ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'git', 'html', 'css'],
      soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'management', 'collaboration'],
      business: ['marketing', 'sales', 'strategy', 'analytics', 'finance', 'operations', 'consulting'],
      creative: ['design', 'photoshop', 'illustrator', 'creative', 'branding', 'ui', 'ux']
    };

    const detectedSkills = {};
    
    Object.entries(skillCategories).forEach(([category, skills]) => {
      detectedSkills[category] = skills.filter(skill => words.includes(skill));
    });

    return detectedSkills;
  };

  const analyzeIndustry = (words) => {
    const industries = {
      'Technology': ['software', 'developer', 'engineer', 'tech', 'programming', 'coding'],
      'Healthcare': ['medical', 'nurse', 'doctor', 'healthcare', 'hospital', 'patient'],
      'Finance': ['finance', 'banking', 'investment', 'accounting', 'financial'],
      'Marketing': ['marketing', 'advertising', 'brand', 'campaign', 'social media'],
      'Education': ['teacher', 'education', 'academic', 'research', 'university'],
      'Design': ['design', 'creative', 'graphic', 'ui', 'ux', 'visual']
    };

    let bestMatch = { industry: 'General', confidence: 0 };
    
    Object.entries(industries).forEach(([industry, keywords]) => {
      const matches = keywords.filter(keyword => words.includes(keyword)).length;
      const confidence = matches / keywords.length;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { industry, confidence };
      }
    });

    return bestMatch;
  };

  const analyzeStrengthsWeaknesses = (input) => {
    const sentences = input.split('.').filter(s => s.trim().length > 10);
    
    const strengths = [];
    const improvements = [];

    // Analyze for positive indicators
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      if (lower.includes('led') || lower.includes('managed') || lower.includes('increased')) {
        strengths.push('Leadership and impact demonstrated');
      }
      if (lower.includes('team') || lower.includes('collaborate')) {
        strengths.push('Strong collaboration skills');
      }
      if (lower.includes('project') || lower.includes('delivered')) {
        strengths.push('Project delivery experience');
      }
    });

    // Suggest improvements
    if (!input.includes('quantif') && !input.match(/\d+%/)) {
      improvements.push('Add quantifiable achievements (percentages, numbers, metrics)');
    }
    if (input.length < 200) {
      improvements.push('Provide more detailed description of your experience');
    }
    if (!input.includes('award') && !input.includes('recognition')) {
      improvements.push('Include any awards or recognition received');
    }

    return { strengths: [...new Set(strengths)], improvements };
  };

  const generateSuggestions = (words, experienceLevel) => {
    const suggestions = [];

    if (experienceLevel.level === 'Entry Level') {
      suggestions.push('Highlight your education, internships, and relevant coursework');
      suggestions.push('Include personal projects and volunteer work');
      suggestions.push('Focus on transferable skills and enthusiasm to learn');
    } else if (experienceLevel.level === 'Senior' || experienceLevel.level === 'Executive') {
      suggestions.push('Emphasize leadership experience and team management');
      suggestions.push('Include strategic initiatives and business impact');
      suggestions.push('Highlight mentoring and knowledge sharing activities');
    }

    if (!words.includes('certif')) {
      suggestions.push('Consider adding relevant certifications to strengthen your profile');
    }

    if (!words.includes('language')) {
      suggestions.push('Include language skills if you speak multiple languages');
    }

    return suggestions;
  };

  const calculateCompletenessScore = (input) => {
    let score = 0;
    const checks = [
      { condition: input.length > 100, points: 20, label: 'Sufficient detail' },
      { condition: /\d+\s*years?/.test(input), points: 15, label: 'Experience duration' },
      { condition: /(skill|technology|tool)/.test(input.toLowerCase()), points: 15, label: 'Skills mentioned' },
      { condition: /(company|work|job)/.test(input.toLowerCase()), points: 15, label: 'Work experience' },
      { condition: /(education|degree|university)/.test(input.toLowerCase()), points: 10, label: 'Education' },
      { condition: /(project|built|developed)/.test(input.toLowerCase()), points: 10, label: 'Projects/achievements' },
      { condition: /(email|contact|phone)/.test(input.toLowerCase()), points: 5, label: 'Contact information' },
      { condition: input.length > 300, points: 10, label: 'Comprehensive description' }
    ];

    checks.forEach(check => {
      if (check.condition) score += check.points;
    });

    return { score, maxScore: 100, checks };
  };

  const calculateProfessionalScore = (input) => {
    let score = 0;
    const checks = [
      { condition: /\b(led|managed|directed|supervised)\b/i.test(input), points: 20, label: 'Leadership keywords' },
      { condition: /\b(achieved|improved|increased|reduced)\b/i.test(input), points: 20, label: 'Achievement-focused language' },
      { condition: /\d+%|\$\d+|\d+\+/.test(input), points: 15, label: 'Quantified results' },
      { condition: /\b(collaborated|partnered|coordinated)\b/i.test(input), points: 10, label: 'Teamwork emphasis' },
      { condition: /\b(innovative|strategic|efficient)\b/i.test(input), points: 10, label: 'Professional adjectives' },
      { condition: input.split('.').length > 3, points: 10, label: 'Well-structured sentences' },
      { condition: !/\b(i think|maybe|probably)\b/i.test(input), points: 15, label: 'Confident language' }
    ];

    checks.forEach(check => {
      if (check.condition) score += check.points;
    });

    return { score, maxScore: 100, checks };
  };

  const analyzeKeywordDensity = (words) => {
    const importantKeywords = ['experience', 'skills', 'management', 'development', 'project', 'team', 'leadership'];
    const density = {};
    
    importantKeywords.forEach(keyword => {
      const count = (words.match(new RegExp(keyword, 'g')) || []).length;
      density[keyword] = count;
    });

    return density;
  };

  if (!userInput || userInput.length < 50) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <Brain className="mx-auto text-gray-400 mb-3" size={32} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Analysis Ready</h3>
        <p className="text-gray-600 text-sm">
          Write at least 50 characters about your background to get AI-powered insights
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">AI Analyzing Your Profile...</h3>
        <p className="text-gray-600 text-sm text-center">
          Our AI is examining your background to provide personalized insights
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={24} />
          <h3 className="text-xl font-bold">AI Analysis Results</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-violet-100 text-sm">Completeness Score</p>
            <p className="text-2xl font-bold">{analysis.completenessScore.score}/100</p>
          </div>
          <div>
            <p className="text-violet-100 text-sm">Professional Score</p>
            <p className="text-2xl font-bold">{analysis.professionalScore.score}/100</p>
          </div>
        </div>
      </div>

      {/* Experience Level */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-blue-600" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">Experience Level</h4>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xl font-bold text-blue-600">{analysis.experienceLevel.level}</p>
            <p className="text-gray-600 text-sm">{analysis.experienceLevel.description}</p>
          </div>
          {analysis.experienceLevel.years > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{analysis.experienceLevel.years}</p>
              <p className="text-gray-500 text-sm">Years</p>
            </div>
          )}
        </div>
      </div>

      {/* Industry Focus */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-green-600" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">Industry Focus</h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-green-600">{analysis.industryFocus.industry}</p>
            <p className="text-gray-600 text-sm">
              {Math.round(analysis.industryFocus.confidence * 100)}% confidence match
            </p>
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Star className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-purple-600" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">Skills Detected</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(analysis.skillsDetected).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category}>
                <p className="font-semibold text-gray-700 capitalize mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-yellow-600" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">AI Suggestions</h4>
        </div>
        <div className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      {analysis.strengthsWeaknesses.improvements.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-600" size={20} />
            <h4 className="text-lg font-semibold text-gray-800">Areas for Improvement</h4>
          </div>
          <div className="space-y-3">
            {analysis.strengthsWeaknesses.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
