import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, Download, Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

// Enhanced Toast Notifications
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    icon: '✅',
    ...options
  });
};

export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    icon: '❌',
    ...options
  });
};

export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
    icon: 'ℹ️',
    ...options
  });
};

export const showWarningToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    },
    icon: '⚠️',
    ...options
  });
};

// Progress Toast for long operations
export const showProgressToast = (message, promise, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: message,
      success: options.successMessage || 'Operation completed successfully!',
      error: options.errorMessage || 'Operation failed. Please try again.',
    },
    {
      style: {
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      loading: {
        style: {
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
        },
      },
      success: {
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        },
      },
      error: {
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        },
      },
    }
  );
};

// Custom Notification Component
export const CustomNotification = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = true, 
  onClose,
  autoClose = true,
  duration = 5000,
  actions = []
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      case 'download':
        return <Download className="w-6 h-6 text-blue-600" />;
      case 'save':
        return <Save className="w-6 h-6 text-green-600" />;
      case 'theme':
        return <Palette className="w-6 h-6 text-purple-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'download':
        return 'bg-blue-50 border-blue-200';
      case 'save':
        return 'bg-green-50 border-green-200';
      case 'theme':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in-right`}>
      <div className={`${getBgColor()} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm text-gray-700">
              {message}
            </p>
            
            {actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      action.primary 
                        ? 'bg-violet-600 text-white hover:bg-violet-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setShow(false);
              if (onClose) onClose();
            }}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Hook
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess: (message, options) => showSuccessToast(message, options),
    showError: (message, options) => showErrorToast(message, options),
    showInfo: (message, options) => showInfoToast(message, options),
    showWarning: (message, options) => showWarningToast(message, options),
    showProgress: (message, promise, options) => showProgressToast(message, promise, options),
  };
};
