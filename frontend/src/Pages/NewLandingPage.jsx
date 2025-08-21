import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, LayoutTemplate, Menu, X, Zap, Download, 
  Sparkles, Brain, Target, CheckCircle, Star, Users, 
  TrendingUp, Shield, Clock, Palette, FileText, Globe
} from "lucide-react"; 
import { UserContext } from "../context/userContext";
import Modal from "../components/Modal";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import EnhancedButton from "../components/EnhancedButton";
import DarkModeToggle from "../components/DarkModeToggle";
import { useDarkMode } from "../context/darkModeContext";

const NewLandingPage = () => {
  const { user } = React.useContext(UserContext) || {};
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setOpenAuthModal(true);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Let our AI analyze your background and create a professional resume in seconds"
    },
    {
      icon: Palette,
      title: "Beautiful Templates",
      description: "Choose from 16+ professionally designed themes and templates"
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your changes instantly with our live preview feature"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Download as PDF, PNG, or JPG with multiple quality settings"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your information"
    },
    {
      icon: Globe,
      title: "Mobile Responsive",
      description: "Create and edit resumes on any device, anywhere, anytime"
    }
  ];

  const stats = [
    { number: "16+", label: "Professional Themes" },
    { number: "AI", label: "Powered Analysis" },
    { number: "ATS", label: "Compatible" },
    { number: "Free", label: "To Use" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50'
    }`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <LayoutTemplate className="text-white" size={20} />
              </div>
              <span className={`text-xl font-black transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Resume Builder
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
              }`}>Features</a>
              <a href="#about" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
              }`}>About</a>
              <a href="#demo" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
              }`}>Demo</a>
              <a href="#contact" className={`transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
              }`}>Contact</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle size="sm" />

              {user ? (
                <EnhancedButton
                  onClick={() => navigate("/dashboard")}
                  variant="primary"
                  icon={ArrowRight}
                >
                  Go to Dashboard
                </EnhancedButton>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCurrentPage("login");
                      setOpenAuthModal(true);
                    }}
                    className={`transition-colors ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <EnhancedButton
                    onClick={() => {
                      setCurrentPage("signup");
                      setOpenAuthModal(true);
                    }}
                    variant="primary"
                    icon={ArrowRight}
                  >
                    Get Started Free
                  </EnhancedButton>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t animate-fade-in-down transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-4">
                <a href="#features" className={`block transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
                }`}>Features</a>
                <a href="#about" className={`block transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
                }`}>About</a>
                <a href="#demo" className={`block transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
                }`}>Demo</a>
                <a href="#contact" className={`block transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-violet-400' : 'text-gray-600 hover:text-violet-600'
                }`}>Contact</a>
              </nav>
              <div className={`pt-4 border-t space-y-3 transition-colors duration-300 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {/* Dark Mode Toggle for Mobile */}
                <div className="flex items-center justify-between">
                  <span className={`font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Theme</span>
                  <DarkModeToggle size="sm" />
                </div>

                {user ? (
                  <EnhancedButton
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    variant="primary"
                    fullWidth
                  >
                    Go to Dashboard
                  </EnhancedButton>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPage("login");
                        setOpenAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Sign In
                    </button>
                    <EnhancedButton
                      onClick={() => {
                        setCurrentPage("signup");
                        setOpenAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      variant="primary"
                      fullWidth
                    >
                      Get Started Free
                    </EnhancedButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className={`relative overflow-hidden py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50'
        }`}>
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full opacity-10 animate-pulse animate-delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium animate-bounce">
                    <Sparkles size={16} />
                    <span>AI-Powered Resume Builder</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                    Build Professional
                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Resumes </span>
                    with AI
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed">
                    A modern resume builder featuring AI-powered optimization, ATS compatibility checking,
                    and professional templates. Built as a portfolio project showcasing full-stack development skills.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-600">
                  <EnhancedButton
                    onClick={handleCTA}
                    variant="primary"
                    icon={Sparkles}
                    size="lg"
                    className="animate-pulse-glow"
                  >
                    Start Building with AI
                  </EnhancedButton>
                  <EnhancedButton
                    onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="outline"
                    icon={LayoutTemplate}
                    size="lg"
                  >
                    View Templates
                  </EnhancedButton>
                </div>

                {/* Project Highlights */}
                <div className="flex items-center gap-6 text-sm text-gray-500 animate-fade-in-up animate-delay-800">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>Open Source</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Modern Tech Stack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} />
                    <span>Portfolio Project</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Resume Preview */}
              <div className={`relative ${isVisible ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
                <div className="relative">
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-20 animate-float"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl opacity-20 animate-float animate-delay-1000"></div>
                  
                  {/* Resume Preview */}
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-violet-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Powerful Features for
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Professional Results</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to create, customize, and export professional resumes that get you hired
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Showcase Section */}
        <section id="templates" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Professional
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Templates</span>
              </h2>
              <p className="text-xl text-gray-600">
                Choose from 16+ professionally designed themes to make your resume stand out
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Template Preview Cards */}
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-48 bg-white rounded-lg shadow-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <FileText className="text-white" size={24} />
                      </div>
                      <h3 className="font-bold text-gray-900">Professional Blue</h3>
                      <p className="text-sm text-gray-600">Corporate & Trustworthy</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-48 bg-white rounded-lg shadow-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <h3 className="font-bold text-gray-900">Modern Purple</h3>
                      <p className="text-sm text-gray-600">Creative & Contemporary</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Creative
                    </span>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-48 bg-white rounded-lg shadow-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Target className="text-white" size={24} />
                      </div>
                      <h3 className="font-bold text-gray-900">Elegant Green</h3>
                      <p className="text-sm text-gray-600">Natural & Calming</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      Professional
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Plus 13 more themes including Corporate Gray, Vibrant Pink, Ocean Blue, Sunset Orange, and more!
              </p>
              <EnhancedButton
                onClick={handleCTA}
                variant="primary"
                icon={LayoutTemplate}
                size="lg"
              >
                Explore All Templates
              </EnhancedButton>
            </div>
          </div>
        </section>

        {/* About This Project Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-violet-50 to-fuchsia-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                About This
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Project</span>
              </h2>
              <p className="text-xl text-gray-600">
                A full-stack web application showcasing modern development practices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Built with Modern Technologies</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Frontend:</strong> React.js, Tailwind CSS, Vite</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Backend:</strong> Node.js, Express.js, MongoDB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Features:</strong> JWT Authentication, PDF Generation, File Upload</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>AI Integration:</strong> Resume optimization and ATS scoring</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features Implemented</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">User authentication & authorization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">Real-time resume editing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">Multiple professional themes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">AI-powered optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">ATS compatibility checking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-gray-700">PDF export functionality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 bg-gradient-to-r from-violet-600 to-fuchsia-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Try the Application
            </h2>
            <p className="text-xl text-violet-100 mb-8">
              Experience the full functionality of this AI-powered resume builder.
              Create an account to explore all features including AI optimization and ATS scoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton
                onClick={handleCTA}
                variant="secondary"
                icon={Sparkles}
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-50"
              >
                Try the Demo
              </EnhancedButton>
              <EnhancedButton
                onClick={() => navigate("/ai-generator")}
                variant="outline"
                icon={Brain}
                size="lg"
                className="border-white text-white hover:bg-white hover:text-violet-600"
              >
                AI Generator
              </EnhancedButton>
            </div>
          </div>
        </section>

        {/* Auth Modal */}
        <Modal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)}>
          {currentPage === "login" ? (
            <Login onSwitchToSignUp={() => setCurrentPage("signup")} />
          ) : (
            <SignUp onSwitchToLogin={() => setCurrentPage("login")} />
          )}
        </Modal>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <LayoutTemplate className="text-white" size={16} />
                </div>
                <span className="text-lg font-bold">AI Resume Builder</span>
              </div>
              <p className="text-gray-400 mb-4">
                A full-stack web application built to demonstrate modern development practices
                and AI integration capabilities. Created as a portfolio project.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>© 2024 Portfolio Project</span>
                <span>•</span>
                <span>Built with React & Node.js</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Technologies Used</h3>
              <ul className="space-y-2 text-gray-400">
                <li>React.js & Tailwind CSS</li>
                <li>Node.js & Express.js</li>
                <li>MongoDB & JWT Auth</li>
                <li>PDF Generation & AI Integration</li>
              </ul>

              <h3 className="font-semibold mb-4 mt-6">Project Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
