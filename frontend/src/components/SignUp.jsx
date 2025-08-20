import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authStyles as styles } from "../assets/dummystyle";
import { UserContext } from "../context/userContext";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// ✅ fallback Input if you don't have a custom one
const Input = ({ type = "text", value, onChange, placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={styles.input}
  />
);

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify({ name: fullName, email }));

        updateUser({ name: fullName, email });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Signup Card */}
      <div className={styles.signupContainer}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.signupTitle}>Sign Up</h2>
          <p className={styles.signupSubtitle}>Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className={styles.signupForm}>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.signupSubmit}>
            Sign Up
          </button>

          {/* Footer */}
          <p className={styles.switchText}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className={styles.signupSwitchButton}
            >
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
