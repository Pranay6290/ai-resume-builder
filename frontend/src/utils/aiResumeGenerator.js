// AI Resume Generator Service
// This service generates complete resume content from user prompts

/**
 * Generate a complete resume from user input using AI-like parsing
 * @param {string} userInput - User's description of their background
 * @returns {Object} - Complete resume data structure
 */
export const generateResumeFromPrompt = async (userInput) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const input = userInput.toLowerCase();
  const originalInput = userInput;

  // Extract comprehensive information from the prompt
  const resumeData = {
    title: `AI Generated Resume - ${new Date().toLocaleDateString()}`,
    profileInfo: {
      fullName: extractName(originalInput) || "John Professional",
      designation: extractRole(input) || "Professional",
      summary: generateSummary(originalInput, input)
    },
    contactInfo: {
      email: extractEmail(originalInput) || "john.professional@email.com",
      phone: extractPhone(originalInput) || "+1 (555) 123-4567",
      location: extractLocation(originalInput) || "New York, NY",
      linkedin: generateLinkedIn(extractName(originalInput)),
      github: extractGithub(originalInput) || (input.includes('developer') || input.includes('engineer') ? generateGithub(extractName(originalInput)) : ""),
      website: extractWebsite(originalInput) || ""
    },
    workExperience: generateWorkExperience(input, originalInput),
    education: generateEducation(input, originalInput),
    skills: generateSkills(input, originalInput),
    projects: generateProjects(input, originalInput),
    certifications: generateCertifications(input, originalInput),
    languages: generateLanguages(input, originalInput),
    interests: generateInterests(input, originalInput),
    template: {
      id: "01",
      theme: "professional"
    }
  };

  return resumeData;
};

// Helper functions for extraction and generation

const extractName = (input) => {
  // Look for "I'm [Name]" or "My name is [Name]" patterns
  const namePatterns = [
    /(?:i'm|i am|my name is|call me)\s+([a-z]+(?:\s+[a-z]+)*)/i,
    /^([a-z]+\s+[a-z]+)/i // First two words if they look like a name
  ];

  for (const pattern of namePatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1].split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
  }
  return null;
};

const extractRole = (input) => {
  const roles = {
    'software engineer': 'Senior Software Engineer',
    'developer': 'Software Developer',
    'frontend developer': 'Frontend Developer',
    'backend developer': 'Backend Developer',
    'full stack': 'Full Stack Developer',
    'data scientist': 'Data Scientist',
    'product manager': 'Product Manager',
    'marketing': 'Marketing Manager',
    'designer': 'UI/UX Designer',
    'graphic designer': 'Graphic Designer',
    'business analyst': 'Business Analyst',
    'project manager': 'Project Manager',
    'sales': 'Sales Manager',
    'consultant': 'Business Consultant',
    'teacher': 'Educator',
    'nurse': 'Registered Nurse',
    'accountant': 'Senior Accountant',
    'lawyer': 'Legal Counsel',
    'doctor': 'Medical Doctor'
  };

  for (const [key, value] of Object.entries(roles)) {
    if (input.includes(key)) {
      return value;
    }
  }
  return 'Professional';
};

const generateSummary = (originalInput, lowerInput) => {
  const experience = extractExperience(lowerInput);
  const skills = extractSkillsFromText(lowerInput);
  const role = extractRole(lowerInput);

  let summary = `Experienced ${role.toLowerCase()} with ${experience} of expertise in `;
  
  if (skills.length > 0) {
    summary += skills.slice(0, 3).join(', ');
  } else {
    summary += 'various technologies and methodologies';
  }

  summary += '. ';

  // Add specific achievements mentioned in the input
  if (lowerInput.includes('increased') || lowerInput.includes('improved') || lowerInput.includes('reduced')) {
    summary += 'Proven track record of delivering measurable results and driving business growth. ';
  }

  if (lowerInput.includes('team') || lowerInput.includes('lead') || lowerInput.includes('manage')) {
    summary += 'Strong leadership and team collaboration skills. ';
  }

  if (lowerInput.includes('startup') || lowerInput.includes('enterprise') || lowerInput.includes('fortune')) {
    summary += 'Experience working in diverse environments from startups to enterprise organizations. ';
  }

  summary += 'Passionate about innovation, continuous learning, and delivering high-quality solutions that exceed expectations.';

  return summary;
};

const extractExperience = (input) => {
  const expPatterns = [
    /(\d+)\s*years?\s*(?:of\s*)?experience/i,
    /(\d+)\s*years?\s*in/i,
    /(\d+)\+?\s*years?/i
  ];

  for (const pattern of expPatterns) {
    const match = input.match(pattern);
    if (match) {
      const years = parseInt(match[1]);
      return years === 1 ? '1 year' : `${years}+ years`;
    }
  }

  if (input.includes('recent graduate') || input.includes('entry level') || input.includes('new grad')) {
    return 'entry-level experience';
  }

  return '3+ years';
};

const extractSkillsFromText = (input) => {
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust', 'swift',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'sql', 'mongodb',
    'postgresql', 'redis', 'elasticsearch', 'graphql', 'rest api',
    'machine learning', 'ai', 'data analysis', 'tensorflow', 'pytorch'
  ];

  const businessSkills = [
    'project management', 'agile', 'scrum', 'leadership', 'communication',
    'marketing', 'sales', 'analytics', 'strategy', 'consulting',
    'excel', 'powerpoint', 'tableau', 'salesforce', 'hubspot'
  ];

  const designSkills = [
    'photoshop', 'illustrator', 'figma', 'sketch', 'adobe creative suite',
    'ui design', 'ux design', 'graphic design', 'web design', 'branding'
  ];

  const allSkills = [...techSkills, ...businessSkills, ...designSkills];
  const foundSkills = [];

  allSkills.forEach(skill => {
    if (input.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
};

const generateWorkExperience = (input, originalInput) => {
  const experience = extractExperience(input);
  const role = extractRole(input);
  const skills = extractSkillsFromText(input);

  const experiences = [];

  // Generate current/recent position
  const currentExp = {
    jobTitle: role,
    companyName: generateCompanyName(input),
    startDate: generateStartDate(experience),
    endDate: "",
    isCurrentJob: true,
    jobDescription: generateJobDescription(role, skills, input, true)
  };
  experiences.push(currentExp);

  // Generate previous position if experience > 2 years
  const expYears = parseInt(experience) || 3;
  if (expYears > 2) {
    const prevRole = generatePreviousRole(role);
    const prevExp = {
      jobTitle: prevRole,
      companyName: generateCompanyName(input, true),
      startDate: generatePreviousStartDate(experience),
      endDate: generatePreviousEndDate(experience),
      isCurrentJob: false,
      jobDescription: generateJobDescription(prevRole, skills, input, false)
    };
    experiences.push(prevExp);
  }

  // Generate entry-level position if experience > 4 years
  if (expYears > 4) {
    const entryRole = generateEntryRole(role);
    const entryExp = {
      jobTitle: entryRole,
      companyName: generateCompanyName(input, true),
      startDate: generateEntryStartDate(experience),
      endDate: generateEntryEndDate(experience),
      isCurrentJob: false,
      jobDescription: generateJobDescription(entryRole, skills, input, false, true)
    };
    experiences.push(entryExp);
  }

  return experiences;
};

const generateCompanyName = (input, isPrevious = false) => {
  const techCompanies = ['TechCorp Solutions', 'InnovateTech Inc.', 'Digital Dynamics', 'CloudFirst Technologies', 'DataDriven Systems'];
  const marketingCompanies = ['BrandBoost Agency', 'Creative Marketing Co.', 'Growth Partners', 'Digital Reach Inc.', 'Marketing Innovations'];
  const consultingCompanies = ['Strategic Consulting Group', 'Business Solutions Inc.', 'Advisory Partners', 'Growth Consultants', 'Enterprise Solutions'];
  const startups = ['StartupXYZ', 'InnovateNow', 'TechStartup Co.', 'NextGen Solutions', 'Disruptive Technologies'];

  let companies = techCompanies;
  if (input.includes('marketing')) companies = marketingCompanies;
  else if (input.includes('consulting')) companies = consultingCompanies;
  else if (input.includes('startup')) companies = startups;

  return companies[Math.floor(Math.random() * companies.length)];
};

const generateJobDescription = (role, skills, input, isCurrent = false, isEntry = false) => {
  const descriptions = [];

  if (role.includes('Software') || role.includes('Developer')) {
    if (isEntry) {
      descriptions.push('• Developed and maintained web applications using modern frameworks and technologies');
      descriptions.push('• Collaborated with senior developers on code reviews and best practices');
      descriptions.push('• Participated in agile development processes and daily standups');
    } else {
      descriptions.push('• Led development of scalable web applications serving 10,000+ daily active users');
      descriptions.push('• Implemented CI/CD pipelines reducing deployment time by 60%');
      descriptions.push('• Mentored junior developers and conducted technical interviews');
    }
    if (skills.includes('react')) descriptions.push('• Built responsive user interfaces using React and modern JavaScript');
    if (skills.includes('node.js')) descriptions.push('• Developed RESTful APIs using Node.js and Express framework');
    if (skills.includes('aws')) descriptions.push('• Deployed applications on AWS with auto-scaling capabilities');
  }

  if (role.includes('Marketing')) {
    descriptions.push('• Developed and executed integrated marketing campaigns resulting in 45% increase in lead generation');
    descriptions.push('• Managed marketing budget of $500K+ across multiple channels');
    descriptions.push('• Analyzed campaign performance and provided actionable insights to stakeholders');
    if (input.includes('social media')) descriptions.push('• Created and managed social media campaigns across Facebook, Instagram, and LinkedIn');
  }

  if (role.includes('Designer')) {
    descriptions.push('• Created compelling visual designs for web and mobile applications');
    descriptions.push('• Collaborated with product teams to deliver user-centered design solutions');
    descriptions.push('• Maintained brand consistency across all design deliverables');
  }

  // Add generic achievements if no specific ones
  if (descriptions.length < 3) {
    descriptions.push('• Collaborated with cross-functional teams to deliver high-quality projects on time');
    descriptions.push('• Implemented process improvements that increased team efficiency by 25%');
    descriptions.push('• Contributed to strategic planning and decision-making processes');
  }

  return descriptions.join('\n');
};

const generateStartDate = (experience) => {
  const expYears = parseInt(experience) || 3;
  const startYear = new Date().getFullYear() - Math.floor(expYears * 0.4);
  return `${startYear}-01`;
};

const generatePreviousStartDate = (experience) => {
  const expYears = parseInt(experience) || 3;
  const startYear = new Date().getFullYear() - expYears;
  return `${startYear}-06`;
};

const generatePreviousEndDate = (experience) => {
  const expYears = parseInt(experience) || 3;
  const endYear = new Date().getFullYear() - Math.floor(expYears * 0.4);
  return `${endYear}-12`;
};

const generateEntryStartDate = (experience) => {
  const expYears = parseInt(experience) || 5;
  const startYear = new Date().getFullYear() - expYears;
  return `${startYear}-01`;
};

const generateEntryEndDate = (experience) => {
  const expYears = parseInt(experience) || 5;
  const endYear = new Date().getFullYear() - Math.floor(expYears * 0.6);
  return `${endYear}-05`;
};

const generatePreviousRole = (currentRole) => {
  const roleMap = {
    'Senior Software Engineer': 'Software Engineer',
    'Software Developer': 'Junior Software Developer',
    'Marketing Manager': 'Marketing Specialist',
    'Product Manager': 'Associate Product Manager',
    'UI/UX Designer': 'Junior Designer'
  };
  return roleMap[currentRole] || currentRole.replace('Senior ', '').replace('Lead ', '');
};

const generateEntryRole = (currentRole) => {
  const roleMap = {
    'Senior Software Engineer': 'Junior Developer',
    'Software Engineer': 'Software Developer Intern',
    'Marketing Manager': 'Marketing Coordinator',
    'Product Manager': 'Product Analyst',
    'UI/UX Designer': 'Design Intern'
  };
  return roleMap[currentRole] || 'Junior ' + currentRole;
};

// Additional helper functions for other sections
const extractEmail = (input) => {
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
  const match = input.match(emailPattern);
  return match ? match[0] : null;
};

const extractPhone = (input) => {
  const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = input.match(phonePattern);
  return match ? match[0] : null;
};

const extractLocation = (input) => {
  const locationPattern = /(?:in|from|located in|based in)\s+([A-Za-z\s,]+)/i;
  const match = input.match(locationPattern);
  if (match) {
    return match[1].trim();
  }
  
  // Common city patterns
  const cities = ['New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO'];
  return cities[Math.floor(Math.random() * cities.length)];
};

const generateLinkedIn = (name) => {
  if (!name) return '';
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  return `https://linkedin.com/in/${cleanName}`;
};

const extractGithub = (input) => {
  const githubPattern = /github\.com\/[\w-]+/i;
  const match = input.match(githubPattern);
  return match ? `https://${match[0]}` : null;
};

const generateGithub = (name) => {
  if (!name) return '';
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  return `https://github.com/${cleanName}`;
};

const extractWebsite = (input) => {
  const urlPattern = /https?:\/\/[\w.-]+\.\w+/;
  const match = input.match(urlPattern);
  return match ? match[0] : null;
};

const generateEducation = (input, originalInput) => {
  const education = [];
  
  const degreePatterns = {
    'computer science': 'Bachelor of Science in Computer Science',
    'business': 'Bachelor of Business Administration',
    'marketing': 'Bachelor of Arts in Marketing',
    'engineering': 'Bachelor of Engineering',
    'design': 'Bachelor of Fine Arts in Design',
    'mba': 'Master of Business Administration',
    'master': 'Master of Science',
    'phd': 'Doctor of Philosophy'
  };

  let degree = 'Bachelor of Science';
  for (const [key, value] of Object.entries(degreePatterns)) {
    if (input.includes(key)) {
      degree = value;
      break;
    }
  }

  const universities = [
    'University of California, Berkeley',
    'Stanford University',
    'Massachusetts Institute of Technology',
    'Harvard University',
    'University of Washington',
    'Georgia Institute of Technology',
    'University of Texas at Austin',
    'Carnegie Mellon University'
  ];

  const currentYear = new Date().getFullYear();
  const expYears = parseInt(extractExperience(input)) || 3;
  const graduationYear = currentYear - expYears - 1;

  education.push({
    degree,
    institution: universities[Math.floor(Math.random() * universities.length)],
    graduationYear: graduationYear.toString(),
    gpa: input.includes('honor') || input.includes('magna') ? '3.8' : ''
  });

  return education;
};

const generateSkills = (input, originalInput) => {
  const foundSkills = extractSkillsFromText(input);
  const skills = [];

  foundSkills.forEach(skill => {
    skills.push({
      name: skill.charAt(0).toUpperCase() + skill.slice(1),
      level: Math.floor(Math.random() * 30) + 70 // 70-100
    });
  });

  // Add some default skills if none found
  if (skills.length === 0) {
    const defaultSkills = ['Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'];
    defaultSkills.forEach(skill => {
      skills.push({
        name: skill,
        level: Math.floor(Math.random() * 20) + 80
      });
    });
  }

  return skills;
};

const generateProjects = (input, originalInput) => {
  const projects = [];
  const role = extractRole(input);

  if (role.includes('Software') || role.includes('Developer')) {
    projects.push({
      name: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce solution with React frontend and Node.js backend, featuring user authentication, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      link: 'https://github.com/username/ecommerce-platform'
    });
  }

  if (role.includes('Marketing')) {
    projects.push({
      name: 'Digital Marketing Campaign',
      description: 'Led a comprehensive digital marketing campaign that increased brand awareness by 200% and generated $500K in revenue.',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics', 'A/B Testing'],
      link: ''
    });
  }

  return projects;
};

const generateCertifications = (input, originalInput) => {
  const certifications = [];
  const currentYear = new Date().getFullYear();

  if (input.includes('aws') || input.includes('cloud')) {
    certifications.push({
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: (currentYear - 1).toString(),
      credentialId: 'AWS-CSA-' + Math.random().toString(36).substring(7).toUpperCase()
    });
  }

  if (input.includes('google') || input.includes('analytics')) {
    certifications.push({
      name: 'Google Analytics Certified',
      issuer: 'Google',
      date: currentYear.toString(),
      credentialId: 'GA-' + Math.random().toString(36).substring(7).toUpperCase()
    });
  }

  return certifications;
};

const generateLanguages = (input, originalInput) => {
  const languages = [{ name: 'English', proficiency: 'Native' }];

  if (input.includes('spanish')) languages.push({ name: 'Spanish', proficiency: 'Fluent' });
  if (input.includes('french')) languages.push({ name: 'French', proficiency: 'Conversational' });
  if (input.includes('german')) languages.push({ name: 'German', proficiency: 'Intermediate' });
  if (input.includes('chinese') || input.includes('mandarin')) languages.push({ name: 'Mandarin', proficiency: 'Conversational' });

  return languages;
};

const generateInterests = (input, originalInput) => {
  const interests = [];
  
  if (input.includes('music')) interests.push('Music');
  if (input.includes('travel')) interests.push('Travel');
  if (input.includes('photography')) interests.push('Photography');
  if (input.includes('sports') || input.includes('fitness')) interests.push('Fitness');
  if (input.includes('reading')) interests.push('Reading');
  if (input.includes('cooking')) interests.push('Cooking');

  // Add some default interests
  if (interests.length === 0) {
    const defaultInterests = ['Technology', 'Innovation', 'Continuous Learning'];
    interests.push(...defaultInterests);
  }

  return interests;
};
