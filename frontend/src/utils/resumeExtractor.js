// Resume Content Extraction Utility
// This service extracts content from uploaded PDF/Word documents

/**
 * Extract text content from uploaded file
 * @param {File} file - The uploaded resume file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        if (file.type === 'application/pdf') {
          // For PDF files, we'll simulate extraction for now
          // In production, you'd use pdf-parse or similar library
          const simulatedText = await simulatePDFExtraction(file.name);
          resolve(simulatedText);
        } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          // For Word files, we'll simulate extraction
          // In production, you'd use mammoth.js or similar library
          const simulatedText = await simulateWordExtraction(file.name);
          resolve(simulatedText);
        } else {
          reject(new Error('Unsupported file type'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Simulate PDF text extraction (replace with real PDF parsing in production)
 */
const simulatePDFExtraction = async (fileName) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return realistic extracted text
  return `
JOHN SMITH
Senior Software Engineer
Email: john.smith@email.com
Phone: (555) 123-4567
Location: San Francisco, CA
LinkedIn: linkedin.com/in/johnsmith
GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced Senior Software Engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable web applications and leading cross-functional teams. Passionate about clean code, performance optimization, and mentoring junior developers.

WORK EXPERIENCE

Senior Software Engineer | Tech Solutions Inc. | Jan 2020 - Present
• Led development of microservices architecture serving 1M+ daily active users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored 5 junior developers and conducted technical interviews
• Technologies: React, Node.js, AWS, Docker, Kubernetes

Software Engineer | Digital Innovations LLC | Jun 2017 - Dec 2019
• Developed responsive web applications using React and Redux
• Optimized database queries improving application performance by 40%
• Collaborated with UX/UI designers to implement pixel-perfect designs
• Technologies: JavaScript, Python, PostgreSQL, Redis

Junior Developer | StartupXYZ | Aug 2015 - May 2017
• Built RESTful APIs and integrated third-party services
• Participated in agile development processes and code reviews
• Contributed to open-source projects and technical documentation
• Technologies: PHP, MySQL, HTML/CSS, jQuery

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015
GPA: 3.8/4.0

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java, TypeScript, PHP
Frontend: React, Vue.js, Angular, HTML5, CSS3, Sass
Backend: Node.js, Express, Django, Spring Boot
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Git
Tools: VS Code, IntelliJ, Postman, Figma

PROJECTS
E-Commerce Platform | 2023
• Built full-stack e-commerce solution with React and Node.js
• Implemented payment processing with Stripe API
• Deployed on AWS with auto-scaling capabilities
• GitHub: github.com/johnsmith/ecommerce-platform

Task Management App | 2022
• Developed real-time collaboration features using WebSocket
• Implemented user authentication and role-based permissions
• Used MongoDB for flexible data storage
• Live Demo: taskapp.johnsmith.dev

CERTIFICATIONS
AWS Certified Solutions Architect - Associate | 2022
Google Cloud Professional Developer | 2021
Certified Scrum Master (CSM) | 2020

LANGUAGES
English: Native
Spanish: Conversational
French: Basic
  `.trim();
};

/**
 * Simulate Word document text extraction (replace with real Word parsing in production)
 */
const simulateWordExtraction = async (fileName) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return realistic extracted text
  return `
SARAH JOHNSON
Marketing Manager
sarah.johnson@email.com | (555) 987-6543 | New York, NY
LinkedIn: linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven Marketing Manager with 6+ years of experience in digital marketing, brand management, and campaign optimization. Expertise in data-driven marketing strategies, social media management, and cross-channel campaign execution. Proven ability to increase brand awareness and drive revenue growth.

PROFESSIONAL EXPERIENCE

Marketing Manager | Growth Marketing Co. | Mar 2021 - Present
• Developed and executed integrated marketing campaigns resulting in 45% increase in lead generation
• Managed $500K annual marketing budget across multiple channels
• Led team of 4 marketing specialists and coordinated with external agencies
• Implemented marketing automation workflows increasing conversion rates by 30%
• Tools: HubSpot, Google Analytics, Facebook Ads Manager, Salesforce

Digital Marketing Specialist | Creative Agency Ltd. | Jan 2019 - Feb 2021
• Created and managed social media campaigns across Facebook, Instagram, and LinkedIn
• Conducted A/B testing for email campaigns improving open rates by 25%
• Collaborated with design team to create compelling visual content
• Analyzed campaign performance and provided actionable insights to stakeholders
• Tools: Hootsuite, Mailchimp, Adobe Creative Suite, Google Ads

Marketing Coordinator | Retail Solutions Inc. | Jun 2017 - Dec 2018
• Assisted in planning and executing product launch campaigns
• Managed company blog and content calendar
• Coordinated trade show participation and event marketing
• Supported sales team with marketing collateral and lead qualification
• Tools: WordPress, Canva, Eventbrite, CRM systems

EDUCATION
Bachelor of Arts in Marketing
New York University | 2017
Magna Cum Laude, GPA: 3.7/4.0

SKILLS
Digital Marketing: SEO/SEM, Social Media Marketing, Email Marketing, Content Marketing
Analytics: Google Analytics, Facebook Analytics, HubSpot, Tableau
Design: Adobe Creative Suite, Canva, Figma
Project Management: Asana, Trello, Monday.com
CRM: Salesforce, HubSpot, Pipedrive

ACHIEVEMENTS
• Increased organic website traffic by 150% through SEO optimization
• Generated $2M in revenue through targeted digital campaigns
• Achieved 95% customer satisfaction rating for marketing events
• Recognized as "Employee of the Year" 2022

CERTIFICATIONS
Google Ads Certified | 2023
HubSpot Content Marketing Certification | 2022
Facebook Blueprint Certification | 2021
Google Analytics Individual Qualification | 2020

LANGUAGES
English: Native
Spanish: Fluent
Italian: Intermediate
  `.trim();
};

/**
 * Parse extracted text into structured resume data
 * @param {string} extractedText - Raw text from resume
 * @param {string} fileName - Original file name
 * @returns {Object} - Structured resume data
 */
export const parseResumeContent = (extractedText, fileName) => {
  const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Initialize resume data structure
  const resumeData = {
    title: fileName.replace(/\.[^/.]+$/, ""),
    profileInfo: {
      fullName: "",
      designation: "",
      summary: ""
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: ""
    },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: []
  };

  let currentSection = 'header';
  let currentWorkExp = null;
  let currentEducation = null;
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Extract name (usually first non-empty line)
    if (i === 0 && !resumeData.profileInfo.fullName) {
      resumeData.profileInfo.fullName = line;
      continue;
    }

    // Extract designation (usually second line)
    if (i === 1 && !resumeData.profileInfo.designation) {
      resumeData.profileInfo.designation = line;
      continue;
    }

    // Extract contact information
    if (line.includes('@') && !resumeData.contactInfo.email) {
      const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) resumeData.contactInfo.email = emailMatch[0];
    }

    if (line.match(/\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/)) {
      const phoneMatch = line.match(/\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/);
      if (phoneMatch) resumeData.contactInfo.phone = phoneMatch[0];
    }

    if (line.includes('linkedin.com')) {
      resumeData.contactInfo.linkedin = line.includes('http') ? line : `https://${line}`;
    }

    if (line.includes('github.com')) {
      resumeData.contactInfo.github = line.includes('http') ? line : `https://${line}`;
    }

    // Detect sections
    if (upperLine.includes('PROFESSIONAL SUMMARY') || upperLine.includes('SUMMARY')) {
      currentSection = 'summary';
      continue;
    }

    if (upperLine.includes('WORK EXPERIENCE') || upperLine.includes('PROFESSIONAL EXPERIENCE') || upperLine.includes('EXPERIENCE')) {
      currentSection = 'experience';
      continue;
    }

    if (upperLine.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    }

    if (upperLine.includes('SKILLS') || upperLine.includes('TECHNICAL SKILLS')) {
      currentSection = 'skills';
      continue;
    }

    if (upperLine.includes('PROJECTS')) {
      currentSection = 'projects';
      continue;
    }

    if (upperLine.includes('CERTIFICATIONS')) {
      currentSection = 'certifications';
      continue;
    }

    if (upperLine.includes('LANGUAGES')) {
      currentSection = 'languages';
      continue;
    }

    // Process content based on current section
    switch (currentSection) {
      case 'summary':
        if (!upperLine.includes('SUMMARY')) {
          resumeData.profileInfo.summary += (resumeData.profileInfo.summary ? ' ' : '') + line;
        }
        break;

      case 'experience':
        // Detect job entries (usually have company name and dates)
        if (line.includes('|') && (line.includes('20') || line.includes('Present'))) {
          if (currentWorkExp) {
            resumeData.workExperience.push(currentWorkExp);
          }
          
          const parts = line.split('|').map(p => p.trim());
          currentWorkExp = {
            jobTitle: parts[0] || "",
            companyName: parts[1] || "",
            startDate: extractStartDate(parts[2] || ""),
            endDate: extractEndDate(parts[2] || ""),
            isCurrentJob: (parts[2] || "").includes('Present'),
            jobDescription: ""
          };
        } else if (currentWorkExp && line.startsWith('•')) {
          currentWorkExp.jobDescription += (currentWorkExp.jobDescription ? '\n' : '') + line;
        }
        break;

      case 'education':
        if (line.includes('|') && line.includes('20')) {
          const parts = line.split('|').map(p => p.trim());
          resumeData.education.push({
            degree: parts[0] || "",
            institution: parts[1] || "",
            graduationYear: extractYear(parts[2] || ""),
            gpa: extractGPA(line)
          });
        }
        break;

      case 'skills':
        if (line.includes(':')) {
          const skillCategory = line.split(':')[1].trim();
          const skills = skillCategory.split(',').map(s => s.trim());
          skills.forEach(skill => {
            if (skill && !resumeData.skills.find(s => s.name === skill)) {
              resumeData.skills.push({
                name: skill,
                level: Math.floor(Math.random() * 30) + 70 // Random level between 70-100
              });
            }
          });
        }
        break;

      case 'certifications':
        if (line.includes('|') && line.includes('20')) {
          const parts = line.split('|').map(p => p.trim());
          resumeData.certifications.push({
            name: parts[0] || line,
            issuer: parts[1] || "Professional Organization",
            date: parts[1] || extractYear(line),
            credentialId: ""
          });
        }
        break;

      case 'languages':
        if (line.includes(':')) {
          const parts = line.split(':').map(p => p.trim());
          resumeData.languages.push({
            name: parts[0],
            proficiency: parts[1] || "Proficient"
          });
        }
        break;
    }
  }

  // Add the last work experience if exists
  if (currentWorkExp) {
    resumeData.workExperience.push(currentWorkExp);
  }

  // Extract location from contact info
  const locationPattern = /([A-Za-z\s]+,\s*[A-Z]{2})/;
  const locationMatch = extractedText.match(locationPattern);
  if (locationMatch) {
    resumeData.contactInfo.location = locationMatch[0];
  }

  return resumeData;
};

// Helper functions
const extractStartDate = (dateStr) => {
  const match = dateStr.match(/(\w+\s+\d{4})/);
  if (match) {
    const date = new Date(match[0]);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  return "";
};

const extractEndDate = (dateStr) => {
  if (dateStr.includes('Present')) return "";
  const dates = dateStr.split('-').map(d => d.trim());
  if (dates.length > 1) {
    const match = dates[1].match(/(\w+\s+\d{4})/);
    if (match) {
      const date = new Date(match[0]);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
  }
  return "";
};

const extractYear = (str) => {
  const match = str.match(/\d{4}/);
  return match ? match[0] : "";
};

const extractGPA = (str) => {
  const match = str.match(/GPA:\s*(\d+\.\d+)/i);
  return match ? match[1] : "";
};
