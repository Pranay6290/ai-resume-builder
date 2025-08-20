import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./Pages/Dashboard";
import { UserProvider } from "./context/userContext";
import EditResume from "./components/EditResume";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resumes/:resumeId" element={<EditResume />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "14px",
          },
        }}
      />
    </UserProvider>
  );
}

export default App;
