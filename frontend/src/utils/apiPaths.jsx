export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// routes used for frontend
export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    USER: `${BASE_URL}/api/auth`,
  },

  RESUMES: {
    CREATE: `${BASE_URL}/api/resumes`,             // POST → create new resume
    GET_ALL: `${BASE_URL}/api/resumes`,            // GET → fetch all resumes
    GET_BY_ID: (id) => `${BASE_URL}/api/resumes/${id}`,   // GET → fetch single resume by ID
    UPDATE: (id) => `${BASE_URL}/api/resumes/${id}`,      // PUT/PATCH → update resume by ID
    DELETE: (id) => `${BASE_URL}/api/resumes/${id}`,      // DELETE → delete resume by ID
    UPLOAD_IMAGES: (id) => `${BASE_URL}/api/resumes/${id}/upload-images`, // POST/PUT → upload images
    AI_GENERATE: `${BASE_URL}/api/resumes/ai-generate`,   // POST → AI generate resume
  },
};
