import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { ProfileInfoCard } from "./Cards"; // Correct the path if needed!
import { UserContext } from "../context/userContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white/70 backdrop-blur-xl border-b border-violet-100/50 py-2.5 px-4 md:px-0 sticky top-0 z-50">
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

        {/* Profile info card if logged in, else null or login button */}
        <div>
          {user ? (
            <ProfileInfoCard />
          ) : (
            // Optional: add a button to open login/signup modal if user is not logged in
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
