import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, RotateCcw, Download, Share2 } from 'lucide-react';
import RenderResume from './RenderResume';
import { useTheme } from '../context/themeContext';
import { downloadPDF, generateThumbnail } from '../utils/pdfExport';
import { showSuccessToast, showErrorToast, showProgressToast } from './NotificationSystem';
import EnhancedButton from './EnhancedButton';

const LivePreview = ({ 
  resumeData, 
  templateId, 
  className = '',
  showControls = true,
  autoUpdate = true,
  onThumbnailGenerated
}) => {
  const { currentTheme, getTheme, isLivePreview, toggleLivePreview } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Auto-resize preview to fit container
  const updateScale = useCallback(() => {
    if (!previewRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const preview = previewRef.current;
    
    const containerWidth = container.clientWidth - 32; // Account for padding
    const containerHeight = container.clientHeight - 100; // Account for controls
    const previewWidth = preview.scrollWidth;
    const previewHeight = preview.scrollHeight;

    const scaleX = containerWidth / previewWidth;
    const scaleY = containerHeight / previewHeight;
    const newScale = Math.min(scaleX, scaleY, 1);

    setScale(newScale);
  }, []);

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      updateScale();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateScale]);

  // Update preview when data changes
  useEffect(() => {
    if (autoUpdate) {
      setLastUpdate(Date.now());
      setTimeout(updateScale, 100); // Allow render to complete
    }
  }, [resumeData, templateId, currentTheme, autoUpdate, updateScale]);

  // Generate thumbnail when requested
  useEffect(() => {
    if (onThumbnailGenerated && previewRef.current) {
      const generateThumb = async () => {
        try {
          const thumbnail = await generateThumbnail(previewRef, {
            width: 300,
            height: 400
          });
          onThumbnailGenerated(thumbnail);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to generate thumbnail:', error);
          }
        }
      };

      const timeoutId = setTimeout(generateThumb, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [lastUpdate, onThumbnailGenerated]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    setIsGeneratingPDF(true);
    
    try {
      const theme = getTheme(currentTheme);
      const filename = `${resumeData?.profileInfo?.fullName || 'resume'}_${Date.now()}.pdf`;
      
      await showProgressToast(
        'Generating PDF...',
        downloadPDF(previewRef, { 
          filename,
          theme,
          html2canvas: { scale: 3 }
        }),
        {
          successMessage: 'PDF downloaded successfully!',
          errorMessage: 'Failed to download PDF. Please try again.'
        }
      );
    } catch (error) {
      showErrorToast('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resumeData?.profileInfo?.fullName || 'My'} Resume`,
          text: 'Check out my resume!',
          url: window.location.href
        });
      } catch (error) {
        // User cancelled or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showSuccessToast('Link copied to clipboard!');
    }).catch(() => {
      showErrorToast('Failed to copy link');
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetZoom = () => {
    updateScale();
  };

  const theme = getTheme(currentTheme);

  return (
    <div 
      ref={containerRef}
      className={`
        relative bg-white rounded-2xl border border-gray-200 overflow-hidden
        ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full'}
        ${className}
      `}
    >
      {/* Preview Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200">
            {/* Live Preview Toggle */}
            <button
              onClick={toggleLivePreview}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm
                ${isLivePreview 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={isLivePreview ? 'Disable live preview' : 'Enable live preview'}
            >
              {isLivePreview ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="hidden sm:inline">
                {isLivePreview ? 'Live' : 'Static'}
              </span>
            </button>

            {/* Reset Zoom */}
            <button
              onClick={resetZoom}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Reset zoom"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 size={16} className="text-gray-600" />
              ) : (
                <Maximize2 size={16} className="text-gray-600" />
              )}
            </button>

            {/* Download PDF */}
            <EnhancedButton
              size="sm"
              variant="success"
              onClick={handleDownloadPDF}
              isLoading={isGeneratingPDF}
              icon={Download}
              className="text-xs"
            >
              <span className="hidden sm:inline">PDF</span>
            </EnhancedButton>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Share resume"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Status */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200">
          <div className={`w-2 h-2 rounded-full ${isLivePreview ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isLivePreview ? 'Live Preview' : 'Static Preview'}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="w-full h-full flex items-center justify-center p-8 pt-20">
        <div 
          className="transition-transform duration-300 ease-out shadow-2xl rounded-lg overflow-hidden"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <div ref={previewRef} className="bg-white">
            <RenderResume
              templateId={templateId}
              resumeData={resumeData}
              containerWidth={800}
              colorTheme={currentTheme}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGeneratingPDF && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Generating PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
