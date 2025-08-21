import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { ProfileInfoCard } from "./Cards"; // Correct the path if needed!
import { UserContext } from "../context/userContext";
import DarkModeToggle from "./DarkModeToggle";
import { useDarkMode } from "../context/darkModeContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className={`h-16 backdrop-blur-xl border-b py-2.5 px-4 md:px-0 sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-900/70 border-gray-700/50'
        : 'bg-white/70 border-violet-100/50'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center pb-6 gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Resume Expert
            </span>
          </div>
        </Link>

        {/* Right side - Dark mode toggle and profile */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <DarkModeToggle size="sm" />

          {/* Profile info card if logged in, else login button */}
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-fuchsia-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
