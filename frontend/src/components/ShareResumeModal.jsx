import React, { useState } from 'react';
import { X, Mail, Link, Copy, Check, Users, Eye, Edit } from 'lucide-react';
import { showSuccessToast, showErrorToast } from './NotificationSystem';

const ShareResumeModal = ({ isOpen, onClose, resumeId, resumeTitle }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [shareType, setShareType] = useState('view'); // 'view' or 'edit'
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Generate share link
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareToken = generateShareToken();
    const link = `${baseUrl}/shared/${resumeId}?token=${shareToken}&type=${shareType}`;
    setShareLink(link);
    return link;
  };

  // Generate a simple share token (in production, this should be done on the backend)
  const generateShareToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleGenerateLink = () => {
    const link = generateShareLink();
    showSuccessToast('Share link generated successfully!');
  };

  const handleCopyLink = async () => {
    if (!shareLink) {
      handleGenerateLink();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      showSuccessToast('Link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      showErrorToast('Failed to copy link');
    }
  };

  const handleEmailShare = async () => {
    if (!email.trim()) {
      showErrorToast('Please enter an email address');
      return;
    }

    if (!shareLink) {
      handleGenerateLink();
    }

    setIsSharing(true);

    try {
      // Simulate email sending (in production, this would call your backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const emailData = {
        to: email,
        subject: `${resumeTitle} - Resume Shared with You`,
        message: message || `Hi! I've shared my resume "${resumeTitle}" with you. You can ${shareType === 'edit' ? 'view and edit' : 'view'} it using the link below.`,
        shareLink: shareLink || generateShareLink(),
        shareType,
        resumeId
      };

      // In production, send this to your backend:
      // await axiosInstance.post('/api/share-resume', emailData);

      showSuccessToast(`Resume shared successfully with ${email}!`);
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      showErrorToast('Failed to share resume. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Resume</h2>
              <p className="text-sm text-gray-600">{resumeTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShareType('view')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  shareType === 'view'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Eye size={20} className="mx-auto mb-2" />
                <div className="text-sm font-medium">View Only</div>
                <div className="text-xs text-gray-500">Can view and download</div>
              </button>
              <button
                onClick={() => setShareType('edit')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  shareType === 'edit'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Edit size={20} className="mx-auto mb-2" />
                <div className="text-sm font-medium">Can Edit</div>
                <div className="text-xs text-gray-500">Can view, edit & download</div>
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                placeholder="Click 'Generate Link' to create a shareable link"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                {linkCopied ? (
                  <>
                    <Check size={16} className="text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            {!shareLink && (
              <button
                onClick={handleGenerateLink}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Link size={14} />
                Generate Link
              </button>
            )}
          </div>

          {/* Email Sharing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share via Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient's email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEmailShare}
              disabled={isSharing || !email.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSharing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Share via Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResumeModal;
