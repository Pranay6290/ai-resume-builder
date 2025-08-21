import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const EnhancedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  gradient = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-3 text-base gap-2',
    lg: 'px-6 py-4 text-lg gap-3',
    xl: 'px-8 py-5 text-xl gap-3'
  };

  const variantClasses = {
    primary: gradient 
      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 focus:ring-violet-500/50 shadow-lg hover:shadow-xl hover:shadow-violet-200'
      : 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500/50',
    secondary: gradient
      ? 'bg-gradient-to-r from-gray-600 to-slate-600 text-white hover:from-gray-700 hover:to-slate-700 focus:ring-gray-500/50 shadow-lg hover:shadow-xl'
      : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500/50',
    success: gradient
      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500/50 shadow-lg hover:shadow-xl hover:shadow-emerald-200'
      : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/50',
    danger: gradient
      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:ring-red-500/50 shadow-lg hover:shadow-xl hover:shadow-red-200'
      : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50',
    warning: gradient
      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 focus:ring-amber-500/50 shadow-lg hover:shadow-xl hover:shadow-amber-200'
      : 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500/50',
    outline: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white focus:ring-violet-500/50',
    ghost: 'text-violet-600 hover:bg-violet-100 focus:ring-violet-500/50',
    link: 'text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline focus:ring-violet-500/50'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${isPressed ? 'scale-95' : 'hover:scale-105'}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Shimmer Effect for Gradient Buttons */}
      {gradient && variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {/* Button Content */}
      <div className={`relative flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </div>
    </button>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  className = '',
  variant = 'primary',
  size = 'md',
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6', 
    lg: 'w-7 h-7'
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]}
          fixed bottom-6 right-6 z-40
          bg-gradient-to-r from-violet-600 to-fuchsia-600
          text-white rounded-full shadow-2xl
          hover:scale-110 hover:shadow-violet-300
          transition-all duration-300
          flex items-center justify-center
          animate-bounce-subtle
          ${className}
        `}
      >
        {Icon && <Icon className={iconSizeClasses[size]} />}
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className="fixed bottom-20 right-6 z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg animate-fade-in-scale">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  return (
    <div className={`${orientationClasses[orientation]} gap-2 ${className}`}>
      {children}
    </div>
  );
};

// Icon Button
export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'ghost',
  size = 'md',
  className = '',
  tooltip,
  ...props 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-xl transition-all duration-200
          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-500/50
          ${variant === 'ghost' ? 'hover:bg-gray-100 text-gray-600 hover:text-violet-600' : ''}
          ${variant === 'primary' ? 'bg-violet-100 text-violet-600 hover:bg-violet-200' : ''}
          ${variant === 'danger' ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}
          ${className}
        `}
        {...props}
      >
        {Icon && <Icon className={iconSizeClasses[size]} />}
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap animate-fade-in-scale">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedButton;
