import React from 'react';
import { Loader2, FileText, Palette, Download, Save } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  type = 'default',
  showIcon = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4', 
    xl: 'gap-5'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const getIcon = () => {
    switch (type) {
      case 'resume':
        return <FileText className={`${sizeClasses[size]} text-violet-600`} />;
      case 'theme':
        return <Palette className={`${sizeClasses[size]} text-violet-600`} />;
      case 'download':
        return <Download className={`${sizeClasses[size]} text-emerald-600`} />;
      case 'save':
        return <Save className={`${sizeClasses[size]} text-blue-600`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} text-violet-600 animate-spin`} />;
    }
  };

  const getLoadingDots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce animate-delay-100"></div>
      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce animate-delay-200"></div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      {/* Main Loading Animation */}
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-violet-200 rounded-full animate-pulse`}></div>
        
        {/* Spinning Ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-violet-600 rounded-full animate-spin`}></div>
        
        {/* Inner Icon */}
        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            {type === 'default' ? (
              <div className="w-3 h-3 bg-violet-600 rounded-full animate-pulse"></div>
            ) : (
              <div className="scale-50">
                {getIcon()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Message */}
      {message && (
        <div className="text-center">
          <p className={`font-medium text-gray-700 ${textSizeClasses[size]} mb-2`}>
            {message}
          </p>
          {getLoadingDots()}
        </div>
      )}
    </div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ className = '', lines = 3, showAvatar = false }) => (
  <div className={`animate-pulse ${className}`}>
    {showAvatar && (
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )}
    
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  </div>
);

// Page Loading Overlay
export const PageLoader = ({ message = 'Loading your resume...', isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 border border-violet-100">
        <LoadingSpinner size="lg" message={message} type="resume" />
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader = ({ size = 'sm', className = '' }) => (
  <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
);

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export default LoadingSpinner;
