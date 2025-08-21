import React, { useState } from 'react';
import { Type, Layout, Palette, Sliders, RotateCcw, Save } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import { showSuccessToast } from './NotificationSystem';

const TemplateCustomizer = ({ templateId, customizations, onCustomizationChange, onSave }) => {
  const [activeTab, setActiveTab] = useState('typography');
  const [localCustomizations, setLocalCustomizations] = useState({
    typography: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineHeight: 'normal',
      fontWeight: 'normal'
    },
    layout: {
      spacing: 'medium',
      margins: 'medium',
      sectionSpacing: 'medium',
      columnGap: 'medium'
    },
    colors: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      textColor: '#1e293b',
      backgroundColor: '#ffffff'
    },
    sections: {
      showProfileImage: true,
      showSummary: true,
      showSkillsProgress: true,
      showCertifications: true,
      showInterests: true,
      sectionOrder: ['profile', 'experience', 'education', 'skills', 'projects']
    },
    ...customizations
  });

  const tabs = [
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'sections', name: 'Sections', icon: Sliders }
  ];

  const fontFamilies = [
    { value: 'Inter', name: 'Inter (Modern)' },
    { value: 'Roboto', name: 'Roboto (Clean)' },
    { value: 'Open Sans', name: 'Open Sans (Friendly)' },
    { value: 'Lato', name: 'Lato (Professional)' },
    { value: 'Montserrat', name: 'Montserrat (Bold)' },
    { value: 'Playfair Display', name: 'Playfair (Elegant)' }
  ];

  const sizeOptions = [
    { value: 'small', name: 'Small' },
    { value: 'medium', name: 'Medium' },
    { value: 'large', name: 'Large' }
  ];

  const updateCustomization = (category, key, value) => {
    const updated = {
      ...localCustomizations,
      [category]: {
        ...localCustomizations[category],
        [key]: value
      }
    };
    setLocalCustomizations(updated);
    onCustomizationChange?.(updated);
  };

  const resetToDefaults = () => {
    const defaults = {
      typography: {
        fontFamily: 'Inter',
        fontSize: 'medium',
        lineHeight: 'normal',
        fontWeight: 'normal'
      },
      layout: {
        spacing: 'medium',
        margins: 'medium',
        sectionSpacing: 'medium',
        columnGap: 'medium'
      },
      colors: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#60a5fa',
        textColor: '#1e293b',
        backgroundColor: '#ffffff'
      },
      sections: {
        showProfileImage: true,
        showSummary: true,
        showSkillsProgress: true,
        showCertifications: true,
        showInterests: true,
        sectionOrder: ['profile', 'experience', 'education', 'skills', 'projects']
      }
    };
    setLocalCustomizations(defaults);
    onCustomizationChange?.(defaults);
    showSuccessToast('Reset to default settings');
  };

  const handleSave = () => {
    onSave?.(localCustomizations);
    showSuccessToast('Template customizations saved!');
  };

  const renderTypographyTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
        <select
          value={localCustomizations.typography.fontFamily}
          onChange={(e) => updateCustomization('typography', 'fontFamily', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        >
          {fontFamilies.map(font => (
            <option key={font.value} value={font.value}>{font.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <div className="grid grid-cols-3 gap-2">
          {sizeOptions.map(size => (
            <button
              key={size.value}
              onClick={() => updateCustomization('typography', 'fontSize', size.value)}
              className={`p-3 rounded-xl border-2 transition-all ${
                localCustomizations.typography.fontSize === size.value
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
        <div className="grid grid-cols-3 gap-2">
          {['tight', 'normal', 'relaxed'].map(height => (
            <button
              key={height}
              onClick={() => updateCustomization('typography', 'lineHeight', height)}
              className={`p-3 rounded-xl border-2 transition-all capitalize ${
                localCustomizations.typography.lineHeight === height
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {height}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      {Object.entries({
        spacing: 'Overall Spacing',
        margins: 'Page Margins',
        sectionSpacing: 'Section Spacing',
        columnGap: 'Column Gap'
      }).map(([key, label]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map(size => (
              <button
                key={size.value}
                onClick={() => updateCustomization('layout', key, size.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  localCustomizations.layout[key] === size.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderColorsTab = () => (
    <div className="space-y-6">
      {Object.entries({
        primaryColor: 'Primary Color',
        secondaryColor: 'Secondary Color',
        accentColor: 'Accent Color',
        textColor: 'Text Color',
        backgroundColor: 'Background Color'
      }).map(([key, label]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={localCustomizations.colors[key]}
              onChange={(e) => updateCustomization('colors', key, e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={localCustomizations.colors[key]}
              onChange={(e) => updateCustomization('colors', key, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 font-mono text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSectionsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Show/Hide Sections</h4>
        <div className="space-y-3">
          {Object.entries({
            showProfileImage: 'Profile Image',
            showSummary: 'Professional Summary',
            showSkillsProgress: 'Skills Progress Bars',
            showCertifications: 'Certifications',
            showInterests: 'Interests'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localCustomizations.sections[key]}
                onChange={(e) => updateCustomization('sections', key, e.target.checked)}
                className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'typography': return renderTypographyTab();
      case 'layout': return renderLayoutTab();
      case 'colors': return renderColorsTab();
      case 'sections': return renderSectionsTab();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Template Customization</h2>
        <div className="flex gap-2">
          <EnhancedButton
            variant="outline"
            onClick={resetToDefaults}
            icon={RotateCcw}
            size="sm"
          >
            Reset
          </EnhancedButton>
          <EnhancedButton
            variant="primary"
            onClick={handleSave}
            icon={Save}
            size="sm"
          >
            Save
          </EnhancedButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-violet-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TemplateCustomizer;
