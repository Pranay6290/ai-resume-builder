import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/NewLandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./Pages/Dashboard";
import AIResumeGenerator from "./Pages/AIResumeGenerator";
import { UserProvider } from "./context/userContext";
import { ThemeProvider } from "./context/themeContext";
import { DarkModeProvider } from "./context/darkModeContext";
import EditResume from "./components/EditResume";
import SharedResume from "./Pages/SharedResume";
import { Toaster } from "react-hot-toast";
import { initPerformanceOptimizations } from "./utils/performance";
import "./styles/animations.css";

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations();
  }, []);

  return (
    <DarkModeProvider>
      <ThemeProvider>
        <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-generator" element={<AIResumeGenerator />} />
          <Route path="/resumes/:resumeId" element={<EditResume />} />
          <Route path="/shared/:resumeId" element={<SharedResume />} />
        </Routes>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "14px",
              borderRadius: "12px",
              padding: "16px",
              fontWeight: "500",
            },
          }}
          position="top-right"
          reverseOrder={false}
        />
        </UserProvider>
      </ThemeProvider>
    </DarkModeProvider>
  );
}

export default App;
