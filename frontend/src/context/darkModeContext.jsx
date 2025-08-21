import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    
    // Check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light mode
    return false;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedPreference = localStorage.getItem('darkMode');
      if (savedPreference === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setLightMode = () => {
    setIsDarkMode(false);
  };

  const setDarkModeOn = () => {
    setIsDarkMode(true);
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    setLightMode,
    setDarkMode: setDarkModeOn,
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
