import React, { useState } from 'react';
import { HelpCircle, Book, Video, MessageCircle, Search, ChevronRight, ExternalLink, Palette } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import Modal from './Modal';

const HelpSystem = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: Book,
      articles: [
        {
          title: 'Creating Your First Resume',
          content: 'Learn how to create a professional resume from scratch using our intuitive builder.',
          steps: [
            'Click "Create New Resume" from your dashboard',
            'Choose a template that matches your industry',
            'Fill in your personal information',
            'Add your work experience and education',
            'Customize colors and themes',
            'Download or share your resume'
          ]
        },
        {
          title: 'Choosing the Right Template',
          content: 'Select the perfect template for your career level and industry.',
          steps: [
            'Consider your industry (creative vs corporate)',
            'Match your experience level',
            'Think about the role you\'re applying for',
            'Preview different templates',
            'Test how it looks when printed'
          ]
        }
      ]
    },
    {
      id: 'customization',
      name: 'Customization',
      icon: Palette,
      articles: [
        {
          title: 'Customizing Colors and Themes',
          content: 'Make your resume stand out with custom colors and themes.',
          steps: [
            'Open the Theme Selector',
            'Browse pre-made color themes',
            'Create custom color combinations',
            'Preview changes in real-time',
            'Save your custom themes for later use'
          ]
        },
        {
          title: 'Advanced Template Customization',
          content: 'Fine-tune your resume layout and typography.',
          steps: [
            'Access Template Customizer',
            'Adjust font families and sizes',
            'Modify spacing and margins',
            'Show or hide sections',
            'Reorder resume sections'
          ]
        }
      ]
    },
    {
      id: 'export-share',
      name: 'Export & Share',
      icon: Download,
      articles: [
        {
          title: 'Exporting Your Resume',
          content: 'Download your resume in various formats with optimal quality.',
          steps: [
            'Click the Export button',
            'Choose your preferred format (PDF, PNG, JPG)',
            'Select quality settings',
            'Configure advanced options',
            'Download your resume'
          ]
        },
        {
          title: 'Sharing Your Resume',
          content: 'Share your resume online or via email.',
          steps: [
            'Use the Share button for quick sharing',
            'Copy the resume link to clipboard',
            'Email directly from the platform',
            'Print for physical copies',
            'Share on social media'
          ]
        }
      ]
    },
    {
      id: 'tips',
      name: 'Resume Tips',
      icon: MessageCircle,
      articles: [
        {
          title: 'Writing Effective Resume Content',
          content: 'Best practices for resume content that gets noticed.',
          steps: [
            'Use action verbs to describe achievements',
            'Quantify your accomplishments with numbers',
            'Tailor content to each job application',
            'Keep descriptions concise and relevant',
            'Proofread for grammar and spelling errors'
          ]
        },
        {
          title: 'Resume Formatting Best Practices',
          content: 'Format your resume for maximum impact and readability.',
          steps: [
            'Use consistent formatting throughout',
            'Choose readable fonts and appropriate sizes',
            'Maintain proper white space and margins',
            'Use bullet points for easy scanning',
            'Keep it to 1-2 pages maximum'
          ]
        }
      ]
    }
  ];

  const filteredArticles = helpCategories
    .find(cat => cat.id === activeCategory)
    ?.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const quickActions = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: Video,
      action: () => window.open('https://youtube.com/playlist?list=example', '_blank')
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: () => window.open('mailto:support@resumebuilder.com', '_blank')
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: ExternalLink,
      action: () => window.open('https://community.resumebuilder.com', '_blank')
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Help & Support"
      size="xl"
      className="max-h-[90vh]"
    >
      <div className="flex h-[70vh]">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {helpCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  activeCategory === category.id
                    ? 'bg-violet-50 text-violet-700 border border-violet-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <category.icon size={20} />
                <span className="font-medium">{category.name}</span>
                <ChevronRight size={16} className="ml-auto" />
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 transition-all"
                >
                  <action.icon size={18} className="text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredArticles.length > 0 ? (
            <div className="space-y-8">
              {filteredArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{article.title}</h2>
                  <p className="text-gray-600 mb-6">{article.content}</p>
                  
                  {article.steps && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Guide:</h3>
                      <ol className="space-y-3">
                        {article.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-sm font-semibold">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Still need help? <a href="mailto:support@resumebuilder.com" className="text-violet-600 hover:text-violet-700 font-medium">Contact our support team</a>
          </div>
          <EnhancedButton
            variant="outline"
            onClick={onClose}
            size="sm"
          >
            Close
          </EnhancedButton>
        </div>
      </div>
    </Modal>
  );
};

// Help Button Component
export const HelpButton = ({ className = '' }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all ${className}`}
        title="Help & Support"
      >
        <HelpCircle size={20} />
        <span className="hidden sm:inline">Help</span>
      </button>

      <HelpSystem
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

export default HelpSystem;
