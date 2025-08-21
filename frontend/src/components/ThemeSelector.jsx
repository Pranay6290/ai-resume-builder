import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_RESUME_DATA, resumeTemplates, colorThemes } from '../utils/data';
import { useTheme } from '../context/themeContext';
import Tabs from './Tabs';
import { TemplateCard } from './Cards';
import RenderResume from './RenderResume';
import { Check, Palette, Plus, Trash2, Eye, EyeOff, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const TAB_DATA = [
  { label: 'Templates' },
  { label: 'Colors' },
  { label: 'Custom' }
];

const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose, onApplyTheme }) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const {
    currentTheme,
    applyTheme,
    getAllThemes,
    createCustomTheme,
    deleteCustomTheme,
    isLivePreview,
    toggleLivePreview
  } = useTheme();

  // Selecting theme template using id
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0]?.id || '',
    index: initialIndex >= 0 ? initialIndex : 0,
  });

  const [tabValue, setTabValue] = useState('Templates');
  const [selectedColorTheme, setSelectedColorTheme] = useState(currentTheme);
  const [customThemeData, setCustomThemeData] = useState({
    name: '',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0'
  });

  const handleThemeSelection = () => {
    setSelectedTheme(selectedTemplate.theme);
    applyTheme(selectedColorTheme);
    if (onApplyTheme) {
      onApplyTheme({
        templateId: selectedTemplate.theme,
        colorTheme: selectedColorTheme
      });
    }
    toast.success('Theme applied successfully!');
    onClose();
  };

  const handleColorThemeChange = (themeKey) => {
    setSelectedColorTheme(themeKey);
    if (isLivePreview) {
      applyTheme(themeKey);
    }
  };

  const handleCreateCustomTheme = () => {
    if (!customThemeData.name.trim()) {
      toast.error('Please enter a theme name');
      return;
    }

    const newThemeKey = createCustomTheme(customThemeData.name, customThemeData);
    setSelectedColorTheme(newThemeKey);
    setCustomThemeData({
      name: '',
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0'
    });
    toast.success('Custom theme created!');
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);
    return () => {
      window.removeEventListener('resize', updateBaseWidth);
    };
  }, []);

  const allThemes = getAllThemes();

  const ColorThemeCard = ({ themeKey, theme, isSelected, onSelect, onDelete }) => (
    <div
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
        isSelected
          ? 'border-violet-500 bg-violet-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => onSelect(themeKey)}
    >
      {theme.isCustom && (
        <button
          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(themeKey);
          }}
        >
          <Trash2 size={14} />
        </button>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
          style={{ backgroundColor: theme.primary }}
        />
        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-800">{theme.name}</h3>
          {theme.isCustom && <span className="text-xs text-gray-500">Custom</span>}
        </div>
      </div>

      <div className="flex gap-1">
        {[theme.primary, theme.secondary, theme.accent].map((color, idx) => (
          <div
            key={idx}
            className="flex-1 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {isSelected && (
        <div className="absolute top-2 left-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-white to-violet-50 rounded-2xl border border-violet-100">
        <div className="flex items-center gap-4">
          <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${
              isLivePreview
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={toggleLivePreview}
          >
            {isLivePreview ? <Eye size={16} /> : <EyeOff size={16} />}
            Live Preview
          </button>
        </div>

        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          onClick={handleThemeSelection}
        >
          <Check size={18} /> Apply Changes
        </button>
      </div>

      {/* Color Theme Card Component */}
      {(() => {
        const ColorThemeCard = ({ themeKey, theme, isSelected, onSelect, onDelete }) => (
          <div
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              isSelected
                ? 'border-violet-500 bg-violet-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onSelect(themeKey)}
          >
            {theme.isCustom && (
              <button
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(themeKey);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: theme.primary }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-800">{theme.name}</h3>
                {theme.isCustom && <span className="text-xs text-gray-500">Custom</span>}
              </div>
            </div>

            <div className="flex gap-1">
              {[theme.primary, theme.secondary, theme.accent].map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {isSelected && (
              <div className="absolute top-2 left-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
        );

        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Side - Content based on active tab */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">

              {/* Templates Tab */}
              {tabValue === 'Templates' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette className="text-violet-600" size={20} />
                    Choose Template
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] lg:max-h-[70vh] overflow-auto p-2">
                    {resumeTemplates.map((template, index) => (
                      <div key={`template_${index}`} className="space-y-2">
                        <TemplateCard
                          thumbnailImg={template.thumbnailImg}
                          isSelected={selectedTemplate.index === index}
                          onSelect={() => setSelectedTemplate({ theme: template.id, index })}
                        />
                        <div className="text-center">
                          <h4 className="font-semibold text-sm text-gray-800">{template.name}</h4>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Tab */}
              {tabValue === 'Colors' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette className="text-violet-600" size={20} />
                    Color Themes
                  </h3>
                  <div className="grid grid-cols-1 gap-3 max-h-[60vh] lg:max-h-[70vh] overflow-auto">
                    {Object.entries(allThemes).map(([themeKey, theme]) => (
                      <ColorThemeCard
                        key={themeKey}
                        themeKey={themeKey}
                        theme={theme}
                        isSelected={selectedColorTheme === themeKey}
                        onSelect={handleColorThemeChange}
                        onDelete={deleteCustomTheme}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tab */}
              {tabValue === 'Custom' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="text-violet-600" size={20} />
                    Create Custom Theme
                  </h3>
                  <div className="space-y-4 max-h-[60vh] lg:max-h-[70vh] overflow-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme Name</label>
                      <input
                        type="text"
                        value={customThemeData.name}
                        onChange={(e) => setCustomThemeData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                        placeholder="Enter theme name"
                      />
                    </div>

                    {Object.entries(customThemeData).filter(([key]) => key !== 'name').map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => setCustomThemeData(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setCustomThemeData(prev => ({ ...prev, [key]: e.target.value }))}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all text-sm font-mono"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleCreateCustomTheme}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                    >
                      <Plus size={16} />
                      Create Theme
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Area - Preview */}
            <div
              className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6"
              ref={resumeRef}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Live Preview</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isLivePreview ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isLivePreview ? 'Live' : 'Static'}
                  </span>
                </div>
              </div>

              <RenderResume
                templateId={selectedTemplate?.theme || ''}
                resumeData={resumeData || DUMMY_RESUME_DATA}
                containerWidth={baseWidth}
                colorTheme={selectedColorTheme}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ThemeSelector;
