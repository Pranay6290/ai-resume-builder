import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './Inputs';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';


const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleCreateResume = async (e) => {
  e.preventDefault();

  if (!title) {
    setError("Title is required");
    return;
  }

  setError(null);

  try {
    const response = await axiosInstance.post(API_PATHS.RESUMES.CREATE, { title });

    console.log("Resume create API full response:", response.data);

    // ✅ Your backend always sends resumeId directly
    const newResumeId = response.data?.resumeId;

    if (newResumeId) {
      console.log("✅ Extracted ResumeId:", newResumeId);
      navigate(`/resumes/${newResumeId}`);
    } else {
      console.error("❌ ResumeId missing in response:", response.data);
      setError("Failed to create resume. ResumeId missing in response.");
    }

  } catch (err) {
    console.error("❌ Error creating resume:", err);
    if (err.response && err.response.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("An error occurred while creating the resume");
    }
  }
};



  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl border-gray-100 shadow-lg">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">Create a New Resume</h3>
      <p className="text-gray-600 mb-8">Please fill in the details below:</p>
      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter resume title"
          type="text"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all"
        >
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
