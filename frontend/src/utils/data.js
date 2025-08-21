import Resume1 from "../assets/Resume1.png"
import Resume2 from "../assets/Resume2.png"
import Resume3 from "../assets/Resume3.png"

// Enhanced Theme System with Multiple Color Palettes
export const colorThemes = {
  professional: {
    name: "Professional Blue",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
    background: "#f8fafc",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    gradient: "from-blue-600 to-indigo-600"
  },
  modern: {
    name: "Modern Purple",
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    accent: "#a78bfa",
    background: "#faf5ff",
    text: "#1e1b4b",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    gradient: "from-purple-600 to-violet-600"
  },
  creative: {
    name: "Creative Orange",
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#fb923c",
    background: "#fff7ed",
    text: "#9a3412",
    textSecondary: "#a3a3a3",
    border: "#fed7aa",
    gradient: "from-orange-600 to-red-500"
  },
  elegant: {
    name: "Elegant Green",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#34d399",
    background: "#f0fdf4",
    text: "#064e3b",
    textSecondary: "#6b7280",
    border: "#d1fae5",
    gradient: "from-emerald-600 to-teal-600"
  },
  corporate: {
    name: "Corporate Gray",
    primary: "#374151",
    secondary: "#4b5563",
    accent: "#6b7280",
    background: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    gradient: "from-gray-700 to-slate-600"
  },
  vibrant: {
    name: "Vibrant Pink",
    primary: "#db2777",
    secondary: "#ec4899",
    accent: "#f472b6",
    background: "#fdf2f8",
    text: "#831843",
    textSecondary: "#6b7280",
    border: "#fce7f3",
    gradient: "from-pink-600 to-rose-500"
  },
  ocean: {
    name: "Ocean Blue",
    primary: "#0891b2",
    secondary: "#06b6d4",
    accent: "#67e8f9",
    background: "#f0f9ff",
    text: "#164e63",
    textSecondary: "#6b7280",
    border: "#bae6fd",
    gradient: "from-cyan-600 to-blue-600"
  },
  sunset: {
    name: "Sunset Orange",
    primary: "#dc2626",
    secondary: "#f97316",
    accent: "#fbbf24",
    background: "#fffbeb",
    text: "#92400e",
    textSecondary: "#6b7280",
    border: "#fed7aa",
    gradient: "from-red-600 to-yellow-500"
  },
  forest: {
    name: "Forest Green",
    primary: "#166534",
    secondary: "#16a34a",
    accent: "#4ade80",
    background: "#f0fdf4",
    text: "#14532d",
    textSecondary: "#6b7280",
    border: "#bbf7d0",
    gradient: "from-green-700 to-emerald-600"
  },
  royal: {
    name: "Royal Purple",
    primary: "#6b21a8",
    secondary: "#9333ea",
    accent: "#c084fc",
    background: "#faf5ff",
    text: "#581c87",
    textSecondary: "#6b7280",
    border: "#e9d5ff",
    gradient: "from-purple-700 to-indigo-600"
  },
  midnight: {
    name: "Midnight Black",
    primary: "#1f2937",
    secondary: "#374151",
    accent: "#6b7280",
    background: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    gradient: "from-gray-800 to-slate-700"
  },
  crimson: {
    name: "Crimson Red",
    primary: "#b91c1c",
    secondary: "#dc2626",
    accent: "#f87171",
    background: "#fef2f2",
    text: "#7f1d1d",
    textSecondary: "#6b7280",
    border: "#fecaca",
    gradient: "from-red-700 to-rose-600"
  },
  golden: {
    name: "Golden Yellow",
    primary: "#d97706",
    secondary: "#f59e0b",
    accent: "#fbbf24",
    background: "#fffbeb",
    text: "#92400e",
    textSecondary: "#6b7280",
    border: "#fed7aa",
    gradient: "from-amber-600 to-yellow-500"
  },
  arctic: {
    name: "Arctic Blue",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#93c5fd",
    background: "#eff6ff",
    text: "#1e3a8a",
    textSecondary: "#6b7280",
    border: "#dbeafe",
    gradient: "from-blue-700 to-indigo-600"
  },
  sage: {
    name: "Sage Green",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#6ee7b7",
    background: "#ecfdf5",
    text: "#047857",
    textSecondary: "#6b7280",
    border: "#a7f3d0",
    gradient: "from-emerald-600 to-green-500"
  },
  platinum: {
    name: "Platinum Silver",
    primary: "#64748b",
    secondary: "#94a3b8",
    accent: "#cbd5e1",
    background: "#f8fafc",
    text: "#334155",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    gradient: "from-slate-600 to-gray-500"
  },
  ruby: {
    name: "Ruby Red",
    primary: "#be123c",
    secondary: "#e11d48",
    accent: "#f43f5e",
    background: "#fef2f2",
    text: "#881337",
    textSecondary: "#6b7280",
    border: "#fecaca",
    gradient: "from-rose-700 to-pink-600"
  },
  emerald: {
    name: "Emerald Luxury",
    primary: "#047857",
    secondary: "#059669",
    accent: "#10b981",
    background: "#ecfdf5",
    text: "#064e3b",
    textSecondary: "#6b7280",
    border: "#a7f3d0",
    gradient: "from-emerald-700 to-teal-600"
  },
  sapphire: {
    name: "Sapphire Blue",
    primary: "#1e3a8a",
    secondary: "#3730a3",
    accent: "#6366f1",
    background: "#eef2ff",
    text: "#1e1b4b",
    textSecondary: "#6b7280",
    border: "#c7d2fe",
    gradient: "from-blue-800 to-indigo-700"
  },
  bronze: {
    name: "Bronze Elegance",
    primary: "#a16207",
    secondary: "#ca8a04",
    accent: "#eab308",
    background: "#fefce8",
    text: "#713f12",
    textSecondary: "#6b7280",
    border: "#fde047",
    gradient: "from-yellow-700 to-amber-600"
  },
  lavender: {
    name: "Lavender Dream",
    primary: "#7c2d92",
    secondary: "#a21caf",
    accent: "#c084fc",
    background: "#faf5ff",
    text: "#581c87",
    textSecondary: "#6b7280",
    border: "#e9d5ff",
    gradient: "from-purple-800 to-fuchsia-700"
  },
  teal: {
    name: "Teal Professional",
    primary: "#0f766e",
    secondary: "#14b8a6",
    accent: "#5eead4",
    background: "#f0fdfa",
    text: "#134e4a",
    textSecondary: "#6b7280",
    border: "#99f6e4",
    gradient: "from-teal-700 to-cyan-600"
  },
  coral: {
    name: "Coral Sunset",
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#fb923c",
    background: "#fff7ed",
    text: "#9a3412",
    textSecondary: "#6b7280",
    border: "#fed7aa",
    gradient: "from-orange-700 to-red-500"
  },
  indigo: {
    name: "Indigo Night",
    primary: "#4338ca",
    secondary: "#6366f1",
    accent: "#8b5cf6",
    background: "#eef2ff",
    text: "#312e81",
    textSecondary: "#6b7280",
    border: "#c7d2fe",
    gradient: "from-indigo-700 to-purple-600"
  }
};

export const resumeTemplates = [
    {
        id: "01",
        name: "Executive Professional",
        thumbnailImg: Resume1,
        colorPaletteCode: "themeOne",
        defaultTheme: "professional",
        description: "Clean and professional design perfect for executive and corporate roles",
        category: "professional"
    },
    {
        id: "02",
        name: "Modern Minimalist",
        thumbnailImg: Resume2,
        colorPaletteCode: "themeTwo",
        defaultTheme: "modern",
        description: "Contemporary design with modern typography and clean layout",
        category: "modern"
    },
    {
        id: "03",
        name: "Creative Designer",
        thumbnailImg: Resume3,
        colorPaletteCode: "themeThree",
        defaultTheme: "creative",
        description: "Bold and creative design perfect for designers and creative professionals",
        category: "creative"
    },
    {
        id: "04",
        name: "Professional with Photo",
        thumbnailImg: Resume1, // Will create new thumbnail
        colorPaletteCode: "themeFour",
        defaultTheme: "professional",
        description: "Executive layout with profile photo support - perfect for senior roles and leadership positions",
        category: "professional",
        features: ["Profile Photo", "Executive Layout", "Professional Design"]
    },
    {
        id: "05",
        name: "Academic Scholar",
        thumbnailImg: Resume2, // Will create new thumbnail
        colorPaletteCode: "themeFive",
        defaultTheme: "sage",
        description: "Professional academic layout perfect for researchers and educators",
        category: "academic"
    },
    {
        id: "06",
        name: "Healthcare Professional",
        thumbnailImg: Resume3, // Will create new thumbnail
        colorPaletteCode: "themeSix",
        defaultTheme: "teal",
        description: "Clean medical professional design for healthcare workers",
        category: "healthcare"
    },
    {
        id: "07",
        name: "Finance Executive",
        thumbnailImg: Resume1, // Will create new thumbnail
        colorPaletteCode: "themeSeven",
        defaultTheme: "midnight",
        description: "Sophisticated design for finance and banking professionals",
        category: "finance"
    },
    {
        id: "08",
        name: "Marketing Specialist",
        thumbnailImg: Resume2, // Will create new thumbnail
        colorPaletteCode: "themeEight",
        defaultTheme: "coral",
        description: "Dynamic and engaging design for marketing professionals",
        category: "marketing"
    }
]

export const DUMMY_RESUME_DATA = {
    profileInfo: {
        previewUrl: "",
        fullName: "Alex Johnson",
        designation: "Senior Software Developer",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud technologies with a strong focus on clean code architecture and performance optimization. Passionate about mentoring junior developers and implementing agile best practices.",
    },
    contactInfo: {
        email: "alex.johnson.dev@gmail.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/alexjohnson-dev",
        github: "https://github.com/alexjohnson-code",
        website: "https://alexjohnson.dev",
    },
    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science",
            major: "Computer Science",
            minors: "Data Science",
            location: "Stanford, CA",
            graduationYear: "2018"
        },
        {
            institution: "University of California",
            degree: "Bachelor of Science",
            major: "Software Engineering",
            minors: "Mathematics",
            location: "Berkeley, CA",
            graduationYear: "2016"
        }
    ],
    workExperience: [
        {
            role: "Senior Software Engineer",
            company: "TechSolutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020-06-01",
            endDate: "2023-12-31",
            description: "Led a team of 5 developers in building a SaaS platform serving 50,000+ users.\nArchitected microservices using Node.js and React that improved system performance by 40%.\nImplemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes.\nMentored junior developers through code reviews and pair programming sessions."
        },
        {
            role: "Software Developer",
            company: "InnovateSoft",
            location: "San Jose, CA",
            startDate: "2018-07-01",
            endDate: "2020-05-31",
            description: "Developed RESTful APIs handling 10,000+ requests per minute with 99.9% uptime.\nRedesigned legacy frontend using React, improving page load speed by 60%.\nCollaborated with UX team to implement responsive designs for mobile users.\nAutomated testing processes increasing test coverage from 65% to 95%."
        }
    ],
    projects: [
        {
            title: "E-commerce Analytics Dashboard",
            startDate: "2022-03-01",
            endDate: "2022-08-31",
            description: "Built a real-time analytics dashboard for e-commerce clients to track sales, inventory, and customer behavior.",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
            github: "https://github.com/alexjohnson-code/ecommerce-analytics",
            liveDemo: "https://demo.alexjohnson.dev/analytics"
        },
        {
            title: "AI-Powered Code Review Tool",
            startDate: "2021-01-01",
            endDate: "2021-06-30",
            description: "Developed a machine learning tool that analyzes pull requests and suggests code improvements.",
            technologies: ["Python", "TensorFlow", "Flask", "GitHub API"],
            github: "https://github.com/alexjohnson-code/ai-code-review"
        }
    ],
    skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "AWS" },
        { name: "Docker" },
        { name: "Kubernetes" },
        { name: "GraphQL" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "Git" },
        { name: "Agile" },
        { name: "Scrum" },
        { name: "JIRA" }
    ],
    certifications: [
        {
            title: "AWS Certified Solutions Architect",
            year: "2022"
        },
        {
            title: "Google Professional Cloud Architect",
            year: "2021"
        },
        {
            title: "Certified Scrum Master",
            year: "2020"
        }
    ],
    interests: [
        "Open Source Contributions",
        "Machine Learning",
        "Blockchain Technology",
        "Hiking",
        "Photography"
    ]
};