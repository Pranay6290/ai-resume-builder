import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../context/darkModeContext';

const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        ${sizeClasses[size]}
        relative rounded-full border-2 transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gray-800 border-gray-600 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
        }
        shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDarkMode ? 'focus:ring-yellow-400' : 'focus:ring-blue-500'}
        ${className}
      `}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="flex items-center justify-center w-full h-full">
        {isDarkMode ? (
          <Sun 
            size={iconSizes[size]} 
            className="transition-transform duration-300 rotate-0 hover:rotate-12" 
          />
        ) : (
          <Moon 
            size={iconSizes[size]} 
            className="transition-transform duration-300 rotate-0 hover:-rotate-12" 
          />
        )}
      </div>
      
      {/* Animated background */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' 
          : 'bg-gradient-to-br from-blue-400/20 to-purple-400/20'
        }
        opacity-0 hover:opacity-100
      `} />
    </button>
  );
};

export default DarkModeToggle;
