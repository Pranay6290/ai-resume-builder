import React, { useState } from 'react';
import { Download, FileText, Image, Share2, Mail, Printer, Settings } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import { exportWithQuality, generateThumbnail, generatePDFBlob } from '../utils/pdfExport';
import { showSuccessToast, showErrorToast, showProgressToast } from './NotificationSystem';

const ExportOptions = ({ resumeRef, resumeData, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeColors: true,
    includeImages: true,
    optimizeForPrint: false,
    watermark: false
  });

  const formats = [
    { id: 'pdf', name: 'PDF Document', icon: FileText, description: 'Best for sharing and printing' },
    { id: 'png', name: 'PNG Image', icon: Image, description: 'High-quality image format' },
    { id: 'jpg', name: 'JPEG Image', icon: Image, description: 'Compressed image format' }
  ];

  const qualities = [
    { id: 'draft', name: 'Draft', description: 'Fast export, lower quality' },
    { id: 'standard', name: 'Standard', description: 'Balanced quality and size' },
    { id: 'high', name: 'High', description: 'Best quality, larger file' },
    { id: 'print', name: 'Print Ready', description: 'Optimized for printing' }
  ];

  const handleExport = async () => {
    if (!resumeRef?.current) {
      showErrorToast('Resume not available for export');
      return;
    }

    setIsExporting(true);
    const filename = `${resumeData?.profileInfo?.fullName || 'resume'}_${Date.now()}`;

    try {
      switch (selectedFormat) {
        case 'pdf':
          await showProgressToast(
            'Generating PDF...',
            exportWithQuality(resumeRef, selectedQuality, { 
              filename: `${filename}.pdf`,
              ...exportOptions 
            }),
            {
              successMessage: 'PDF exported successfully!',
              errorMessage: 'Failed to export PDF'
            }
          );
          break;

        case 'png':
        case 'jpg':
          const imageData = await generateThumbnail(resumeRef, {
            width: 1200,
            height: 1600,
            format: selectedFormat,
            quality: selectedQuality === 'high' ? 1.0 : 0.8
          });
          
          // Create download link
          const link = document.createElement('a');
          link.href = imageData;
          link.download = `${filename}.${selectedFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          showSuccessToast(`${selectedFormat.toUpperCase()} exported successfully!`);
          break;

        default:
          showErrorToast('Unsupported export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
      showErrorToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${resumeData?.profileInfo?.fullName || 'My'} Resume`,
          text: 'Check out my professional resume!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccessToast('Resume link copied to clipboard!');
      }
    } catch (error) {
      showErrorToast('Failed to share resume');
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${resumeData?.profileInfo?.fullName || 'My'} Resume`);
    const body = encodeURIComponent(`Please find my resume at: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Export Format Selection */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Download className="text-violet-600" size={20} />
            Export Format
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <format.icon size={20} className={selectedFormat === format.id ? 'text-violet-600' : 'text-gray-600'} />
                  <span className="font-semibold text-gray-800">{format.name}</span>
                </div>
                <p className="text-sm text-gray-600">{format.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="text-violet-600" size={20} />
            Quality Settings
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {qualities.map((quality) => (
              <button
                key={quality.id}
                onClick={() => setSelectedQuality(quality.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedQuality === quality.id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1">{quality.name}</div>
                <p className="text-sm text-gray-600">{quality.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Advanced Options</h3>
          <div className="space-y-3">
            {Object.entries({
              includeColors: 'Include colors and themes',
              includeImages: 'Include profile images',
              optimizeForPrint: 'Optimize for printing',
              watermark: 'Add watermark'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions[key]}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <EnhancedButton
            variant="primary"
            onClick={handleExport}
            isLoading={isExporting}
            icon={Download}
            className="flex-1"
          >
            Export {selectedFormat.toUpperCase()}
          </EnhancedButton>

          <div className="flex gap-2">
            <EnhancedButton
              variant="outline"
              onClick={handleShare}
              icon={Share2}
              size="md"
            >
              Share
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              onClick={handleEmail}
              icon={Mail}
              size="md"
            >
              Email
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              onClick={handlePrint}
              icon={Printer}
              size="md"
            >
              Print
            </EnhancedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
