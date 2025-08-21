import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

/**
 * Generate resume content using Gemini AI
 * @param {string} userPrompt - User's description of their background
 * @returns {Object} - Structured resume data
 */
export const generateResumeWithGemini = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a professional resume writer. Based on the following user description, generate a complete, professional resume in JSON format. Extract all possible information and create realistic, professional content where information is missing.

User Description: "${userPrompt}"

Please generate a resume with the following exact JSON structure:

{
  "title": "Professional Resume - [Current Date]",
  "profileInfo": {
    "fullName": "[Extract or generate professional name]",
    "designation": "[Professional title based on experience]",
    "summary": "[3-4 sentence professional summary highlighting key achievements and skills]"
  },
  "contactInfo": {
    "email": "[Extract email or generate professional email]",
    "phone": "[Extract phone or generate format: +1 (555) 123-4567]",
    "location": "[Extract location or generate: City, State]",
    "linkedin": "[Generate LinkedIn URL based on name]",
    "github": "[Generate GitHub URL if tech-related]",
    "website": "[Generate portfolio URL if applicable]"
  },
  "workExperience": [
    {
      "jobTitle": "[Professional job title]",
      "companyName": "[Realistic company name]",
      "startDate": "[YYYY-MM format]",
      "endDate": "[YYYY-MM format or empty if current]",
      "isCurrentJob": [true/false],
      "jobDescription": "[Bullet points with • describing achievements and responsibilities, separated by \\n]"
    }
  ],
  "education": [
    {
      "degree": "[Degree type and field]",
      "institution": "[University/College name]",
      "graduationYear": "[YYYY]",
      "gpa": "[GPA if mentioned or empty]"
    }
  ],
  "skills": [
    {
      "name": "[Skill name]",
      "level": [Number between 70-95]
    }
  ],
  "projects": [
    {
      "name": "[Project name]",
      "description": "[Project description]",
      "technologies": ["[Tech1]", "[Tech2]"],
      "link": "[Project URL or empty]"
    }
  ],
  "certifications": [
    {
      "name": "[Certification name]",
      "issuer": "[Issuing organization]",
      "date": "[YYYY]",
      "credentialId": "[ID or empty]"
    }
  ],
  "languages": [
    {
      "name": "[Language]",
      "proficiency": "[Native/Fluent/Conversational/Basic]"
    }
  ],
  "interests": ["[Interest1]", "[Interest2]", "[Interest3]"]
}

Important Guidelines:
1. Extract ALL information mentioned in the user description
2. Generate realistic, professional content for missing information
3. Make work experience detailed with specific achievements
4. Include quantified results where possible (percentages, numbers)
5. Ensure all dates are realistic and chronological
6. Make skills relevant to the profession mentioned
7. Generate 2-3 work experiences if experience level suggests it
8. Include relevant projects for technical roles
9. Add appropriate certifications for the field
10. Return ONLY the JSON object, no additional text

Generate the resume now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let resumeData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resumeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to local generation if AI fails
      resumeData = generateFallbackResume(userPrompt);
    }

    // Add template information
    resumeData.template = {
      id: "01",
      theme: "professional"
    };

    return resumeData;

  } catch (error) {
    console.error('Gemini AI Error:', error);
    // Fallback to local generation
    return generateFallbackResume(userPrompt);
  }
};

/**
 * Fallback resume generation if AI fails
 * @param {string} userPrompt - User's description
 * @returns {Object} - Basic resume structure
 */
const generateFallbackResume = (userPrompt) => {
  const currentDate = new Date().toLocaleDateString();
  
  // Extract basic information
  const nameMatch = userPrompt.match(/(?:i'm|i am|my name is)\s+([a-z\s]+)/i);
  const emailMatch = userPrompt.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = userPrompt.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  const extractedName = nameMatch ? nameMatch[1].trim() : 'Professional Name';
  const extractedEmail = emailMatch ? emailMatch[0] : 'professional@email.com';
  const extractedPhone = phoneMatch ? phoneMatch[0] : '+1 (555) 123-4567';

  return {
    title: `AI Generated Resume - ${currentDate}`,
    profileInfo: {
      fullName: extractedName,
      designation: extractRole(userPrompt),
      summary: generateSummary(userPrompt)
    },
    contactInfo: {
      email: extractedEmail,
      phone: extractedPhone,
      location: extractLocation(userPrompt) || 'New York, NY',
      linkedin: `https://linkedin.com/in/${extractedName.toLowerCase().replace(/\s+/g, '')}`,
      github: userPrompt.toLowerCase().includes('developer') ? `https://github.com/${extractedName.toLowerCase().replace(/\s+/g, '')}` : '',
      website: ''
    },
    workExperience: generateWorkExperience(userPrompt),
    education: generateEducation(userPrompt),
    skills: generateSkills(userPrompt),
    projects: generateProjects(userPrompt),
    certifications: generateCertifications(userPrompt),
    languages: [{ name: 'English', proficiency: 'Native' }],
    interests: generateInterests(userPrompt),
    template: {
      id: "01",
      theme: "professional"
    }
  };
};

// Helper functions for fallback generation
const extractRole = (prompt) => {
  const roles = {
    'software engineer': 'Senior Software Engineer',
    'developer': 'Software Developer',
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'full stack': 'Full Stack Developer',
    'marketing': 'Marketing Manager',
    'designer': 'UI/UX Designer',
    'manager': 'Project Manager',
    'analyst': 'Business Analyst'
  };

  for (const [key, value] of Object.entries(roles)) {
    if (prompt.toLowerCase().includes(key)) {
      return value;
    }
  }
  return 'Professional';
};

const generateSummary = (prompt) => {
  const experience = extractExperience(prompt);
  return `Experienced professional with ${experience} of expertise in various technologies and methodologies. Proven track record of delivering high-quality solutions and driving business growth. Passionate about innovation, continuous learning, and exceeding expectations.`;
};

const extractExperience = (prompt) => {
  const expMatch = prompt.match(/(\d+)\s*years?\s*(?:of\s*)?experience/i);
  if (expMatch) {
    const years = parseInt(expMatch[1]);
    return years === 1 ? '1 year' : `${years}+ years`;
  }
  return '3+ years';
};

const extractLocation = (prompt) => {
  const locationMatch = prompt.match(/(?:in|from|located in|based in)\s+([A-Za-z\s,]+)/i);
  return locationMatch ? locationMatch[1].trim() : null;
};

const generateWorkExperience = (prompt) => {
  const role = extractRole(prompt);
  const currentYear = new Date().getFullYear();
  
  return [{
    jobTitle: role,
    companyName: 'TechCorp Solutions',
    startDate: `${currentYear - 2}-01`,
    endDate: '',
    isCurrentJob: true,
    jobDescription: '• Led development of key features and improvements\n• Collaborated with cross-functional teams to deliver high-quality solutions\n• Implemented best practices and mentored junior team members\n• Achieved 25% improvement in system performance through optimization'
  }];
};

const generateEducation = (prompt) => {
  const currentYear = new Date().getFullYear();
  let degree = 'Bachelor of Science';
  
  if (prompt.toLowerCase().includes('computer science')) degree = 'Bachelor of Science in Computer Science';
  else if (prompt.toLowerCase().includes('business')) degree = 'Bachelor of Business Administration';
  else if (prompt.toLowerCase().includes('marketing')) degree = 'Bachelor of Arts in Marketing';
  else if (prompt.toLowerCase().includes('engineering')) degree = 'Bachelor of Engineering';

  return [{
    degree,
    institution: 'University of Technology',
    graduationYear: (currentYear - 3).toString(),
    gpa: '3.7'
  }];
};

const generateSkills = (prompt) => {
  const skills = [];
  const skillsMap = {
    'javascript': 'JavaScript',
    'python': 'Python',
    'react': 'React',
    'node': 'Node.js',
    'html': 'HTML/CSS',
    'sql': 'SQL',
    'aws': 'AWS',
    'git': 'Git',
    'marketing': 'Digital Marketing',
    'photoshop': 'Adobe Photoshop',
    'excel': 'Microsoft Excel'
  };

  for (const [key, value] of Object.entries(skillsMap)) {
    if (prompt.toLowerCase().includes(key)) {
      skills.push({
        name: value,
        level: Math.floor(Math.random() * 25) + 70
      });
    }
  }

  // Add default skills if none found
  if (skills.length === 0) {
    skills.push(
      { name: 'Communication', level: 90 },
      { name: 'Problem Solving', level: 85 },
      { name: 'Team Collaboration', level: 88 }
    );
  }

  return skills;
};

const generateProjects = (prompt) => {
  if (prompt.toLowerCase().includes('developer') || prompt.toLowerCase().includes('engineer')) {
    return [{
      name: 'Professional Web Application',
      description: 'Developed a full-stack web application with modern technologies, featuring user authentication, real-time updates, and responsive design.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: ''
    }];
  }
  return [];
};

const generateCertifications = (prompt) => {
  const certs = [];
  if (prompt.toLowerCase().includes('aws')) {
    certs.push({
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: new Date().getFullYear().toString(),
      credentialId: ''
    });
  }
  return certs;
};

const generateInterests = (prompt) => {
  const interests = ['Technology', 'Innovation', 'Continuous Learning'];
  if (prompt.toLowerCase().includes('music')) interests.push('Music');
  if (prompt.toLowerCase().includes('travel')) interests.push('Travel');
  if (prompt.toLowerCase().includes('sports')) interests.push('Sports');
  return interests.slice(0, 4);
};
