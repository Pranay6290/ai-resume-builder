import React, { createContext, useContext, useState, useEffect } from 'react';
import { colorThemes } from '../utils/data';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('professional');
  const [customThemes, setCustomThemes] = useState({});
  const [isLivePreview, setIsLivePreview] = useState(true);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('resumeTheme');
    const savedCustomThemes = localStorage.getItem('customThemes');
    
    if (savedTheme && colorThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedCustomThemes) {
      try {
        setCustomThemes(JSON.parse(savedCustomThemes));
      } catch (error) {
        console.error('Error parsing custom themes:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('resumeTheme', currentTheme);
  }, [currentTheme]);

  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
  }, [customThemes]);

  const getTheme = (themeKey = currentTheme) => {
    return customThemes[themeKey] || colorThemes[themeKey] || colorThemes.professional;
  };

  const applyTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    
    if (isLivePreview) {
      // Apply theme to CSS variables for live preview
      const theme = getTheme(themeKey);
      const root = document.documentElement;
      
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-secondary', theme.secondary);
      root.style.setProperty('--theme-accent', theme.accent);
      root.style.setProperty('--theme-background', theme.background);
      root.style.setProperty('--theme-text', theme.text);
      root.style.setProperty('--theme-text-secondary', theme.textSecondary);
      root.style.setProperty('--theme-border', theme.border);
    }
  };

  const createCustomTheme = (name, themeData) => {
    const customThemeKey = `custom_${Date.now()}`;
    setCustomThemes(prev => ({
      ...prev,
      [customThemeKey]: {
        ...themeData,
        name,
        isCustom: true
      }
    }));
    return customThemeKey;
  };

  const deleteCustomTheme = (themeKey) => {
    setCustomThemes(prev => {
      const updated = { ...prev };
      delete updated[themeKey];
      return updated;
    });
    
    if (currentTheme === themeKey) {
      setCurrentTheme('professional');
    }
  };

  const getAllThemes = () => {
    return {
      ...colorThemes,
      ...customThemes
    };
  };

  const toggleLivePreview = () => {
    setIsLivePreview(prev => !prev);
  };

  const value = {
    currentTheme,
    setCurrentTheme,
    getTheme,
    applyTheme,
    createCustomTheme,
    deleteCustomTheme,
    getAllThemes,
    isLivePreview,
    toggleLivePreview,
    colorThemes,
    customThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
