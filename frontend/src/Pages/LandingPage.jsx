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

const LandingPage = () => {
  const { user } = React.useContext(UserContext) || {};
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
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      text: "This AI resume builder helped me land my dream job at Google. The templates are professional and the AI suggestions were spot-on!"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Microsoft",
      text: "I created 5 different versions of my resume in minutes. The variety of themes and the quality of output is amazing!"
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      company: "Apple",
      text: "The real-time preview and theme customization features are incredible. I got hired within 2 weeks of using this!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <LayoutTemplate className="text-white" size={20} />
              </div>
              <span className="text-xl font-black text-gray-900">
                AI Resume Builder
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-violet-600 transition-colors">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-violet-600 transition-colors">Templates</a>
              <a href="#testimonials" className="text-gray-600 hover:text-violet-600 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-violet-600 transition-colors">Pricing</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
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
                    className="text-gray-600 hover:text-gray-900 transition-colors"
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

          {/* Desktop navigation */}
          <div className="flex md:items-center">
            {user ? (
              <div className="text-white">Welcome, {user.name || "User"}</div>
            ) : (
              <button 
  className={landingPageStyles.desktopAuthButton} 
  onClick={() => setOpenAuthModal(true)}
>
  <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
  <span className={landingPageStyles.desktopAuthButtonText}>
    GET Started
  </span>
</button>

            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in-down">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-violet-600 transition-colors">Features</a>
                <a href="#templates" className="block text-gray-600 hover:text-violet-600 transition-colors">Templates</a>
                <a href="#testimonials" className="block text-gray-600 hover:text-violet-600 transition-colors">Reviews</a>
                <a href="#pricing" className="block text-gray-600 hover:text-violet-600 transition-colors">Pricing</a>
              </nav>
              <div className="pt-4 border-t border-gray-200 space-y-3">
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

      {/* Main content */}
      <main className={landingPageStyles.mainContent}>
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>
            {/* Left Content */}
            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                Your one-stop solution for creating stunning resumes
              </div>
              <h3 className={landingPageStyles.heading}>
                Build Resume
              </h3>
              <p className={landingPageStyles.description}>
                Our AI-powered resume builder helps you create a professional resume that stands out.
              </p>
              <div className={landingPageStyles.ctaButtons}>
                <button className={landingPageStyles.primaryButton} onClick={handleCTA}>
                  <div className={landingPageStyles.primaryButtonOverlay}></div>
                  <span className={landingPageStyles.primaryButtonContent}>
                    Get Started
                    <ArrowRight size={24} className={landingPageStyles.primaryButtonIcon} />
                  </span>
                </button>

                <button 
                  className={landingPageStyles.secondaryButton} 
                  onClick={handleCTA}
                >
                  View Templates
                </button>
              </div>

              {/* Stats Grid */}
              <div className={landingPageStyles.statsContainer}>
                {[
                  { value: '50K+', label: 'Resumes Created', gradient: 'from-violet-600 to-fuchsia-600' },
                  { value: '4.9★', label: 'User Rating', gradient: 'from-orange-500 to-red-500' },
                  { value: '5 Min', label: 'Build Time', gradient: 'from-emerald-500 to-teal-500' }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className={`${landingPageStyles.statItem}`}
                  >
                    <div className={`${landingPageStyles.statNumber} ${stat.gradient}`}>
                      {stat.value}
                    </div>
                    <div className={landingPageStyles.statLabel}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className={landingPageStyles.heroIllustration}>
              <div className={landingPageStyles.heroIllustrationBg}></div>
              <div className={landingPageStyles.heroIllustrationContainer}>
                <svg
                  viewBox="0 0 400 500"
                  className={landingPageStyles.svgContainer}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f8fafc" />
                    </linearGradient>
                  </defs>

                  {/* SVG elements */}
                  <rect x="50" y="50" width="300" height="400" rx="20" className={landingPageStyles.svgRect} />
                  <circle cx="120" cy="120" r="25" className={landingPageStyles.svgCircle} />
                  <rect x="160" y="105" width="120" height="8" rx="4" className={landingPageStyles.svgRectPrimary} />
                  <rect x="160" y="120" width="80" height="6" rx="3" className={landingPageStyles.svgRectSecondary} />
                  <rect x="70" y="170" width="260" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                  <rect x="70" y="185" width="200" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                  <rect x="70" y="200" width="240" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                  <rect x="70" y="230" width="60" height="6" rx="3" className={landingPageStyles.svgRectPrimary} />
                  <rect x="70" y="250" width="40" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                  <rect x="120" y="250" width="50" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                  <rect x="180" y="250" width="45" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                  <rect x="70" y="290" width="80" height="6" rx="3" className={landingPageStyles.svgRectSecondary} />
                  <rect x="70" y="310" width="180" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                  <rect x="70" y="325" width="150" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                  <rect x="70" y="340" width="200" height="4" rx="2" className={landingPageStyles.svgRectLight} />

                  {/* Animated elements */}
                  <circle cx="320" cy="100" r="15" className={landingPageStyles.svgAnimatedCircle}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-10; 0,0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <rect x="30" y="300" width="12" height="12" rx="6" className={landingPageStyles.svgAnimatedRect}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 5,0; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <polygon points="360,200 370,220 350,220" className={landingPageStyles.svgAnimatedPolygon}>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 360 210; 360 360 210; 0 360 210"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </polygon>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Profile Info Card shown only when logged in */}
        {user && (
          <section className="flex justify-center mt-8">
            <ProfileInfoCard/>
          </section>
        )}

        {/* features section */}
        <section className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                Why Choose{" "}
                <span className={landingPageStyles.featuresTitleGradient}>
                  Resume Expert
                </span>
              </h2>
              <p className={landingPageStyles.featuresDescription}>
                Discover the amazing features we offer to help you succeed.
              </p>
            </div>

            {/* Features grid */}
            <div className={landingPageStyles.featuresGrid}>
              {[
                {
                  icon: <Zap className={landingPageStyles.featureIcon} />,
                  title: "Lightning Fast",
                  description:
                    "Create professional resumes in under 5 minutes with our streamlined process",
                  gradient: landingPageStyles.featureIconViolet,
                  bg: landingPageStyles.featureCardViolet,
                },
                {
                  icon: <LayoutTemplate className={landingPageStyles.featureIcon} />,
                  title: "Pro Templates",
                  description:
                    "Choose from dozens of recruiter-approved, industry-specific templates",
                  gradient: landingPageStyles.featureIconFuchsia,
                  bg: landingPageStyles.featureCardFuchsia,
                },
                {
                  icon: <Download className={landingPageStyles.featureIcon} />,
                  title: "Instant Export",
                  description:
                    "Download high-quality PDFs instantly with perfect formatting",
                  gradient: landingPageStyles.featureIconOrange,
                  bg: landingPageStyles.featureCardOrange,
                },
              ].map((feature, index) => (
                <div key={index} className={landingPageStyles.featureCard}>
                  <div className={landingPageStyles.featureCardHover} />
                  <div
                    className={`${landingPageStyles.featureCardContent} ${feature.bg}`}
                  >
                    <div
                      className={`${landingPageStyles.featureIconContainer} ${feature.gradient}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className={landingPageStyles.featureTitle}>{feature.title}</h3>
                    <p className={landingPageStyles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className={landingPageStyles.ctaSection}>
          <div className={landingPageStyles.ctaContainer}>
            <div className={landingPageStyles.ctaCard}>
              <div className={landingPageStyles.ctaCardBg}></div>
              <div className={landingPageStyles.ctaCardContent}>
                <h2 className={landingPageStyles.ctaTitle}>
                  Ready to Build <span className={landingPageStyles.ctaTitleGradient}>Your Resume?</span>
                </h2>
              </div>
            </div>
            <p className={landingPageStyles.ctaDescription}>
              Sign up now and take the first step towards your dream job!
            </p>
            <button 
              className={landingPageStyles.ctaButton} 
              onClick={handleCTA}
            >
              <div className={landingPageStyles.ctaButtonOverlay}></div>
              <span className={landingPageStyles.ctaButtonText}>Start Building Your Resume</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={landingPageStyles.footer}>
        <div className={landingPageStyles.footerContainer}>
          <p className={landingPageStyles.footerText}>
            &copy; {new Date().getFullYear()} Resume Expert. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modal for login and sign up */}
      <Modal 
        isOpen={openAuthModal} 
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");  // consistent casing
        }} 
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "signUp" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
