import React, { useEffect, useState } from 'react'
import { modalStyles as styles } from '../assets/dummystyle'
import { X } from 'lucide-react'

const Modal = ({
  children,
  isOpen,
  onClose,
  title = "Modal",
  hideHeader = false,
  showActionBtn = false,
  actionBtnIcon = null,
  actionBtnText = "Action",
  onActionClick = () => {},
  size = 'lg',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center w-full h-full z-50
        transition-all duration-300 ease-out
        ${isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'}
      `}
      onClick={handleOverlayClick}
    >
      <div
        className={`
          relative flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-violet-100
          ${sizeClasses[size]} max-h-[95vh] mx-4
          transition-all duration-300 ease-out
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          ${className}
        `}
      >
        {/* Enhanced Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-6 border-b border-violet-100 bg-gradient-to-r from-white to-violet-50">
            <h3 className="text-xl font-black text-slate-900">{title}</h3>

            <div className="flex items-center gap-3">
              {showActionBtn && (
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                  onClick={onActionClick}
                >
                  {actionBtnIcon}
                  {actionBtnText}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Close Button */}
        {showCloseButton && (
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-lg hover:scale-110 z-10"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
