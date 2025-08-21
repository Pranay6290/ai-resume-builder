import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, Download, Edit, Lock, Share2, ArrowLeft } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import LivePreview from '../components/LivePreview';
import { showSuccessToast, showErrorToast } from '../components/NotificationSystem';

const SharedResume = () => {
  const { resumeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const shareType = searchParams.get('type') || 'view';
  
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSharedResume();
  }, [resumeId, token]);

  const fetchSharedResume = async () => {
    if (!resumeId || !token) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    try {
      // In production, this would validate the share token on the backend
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_BY_ID(resumeId));
      
      if (response.data) {
        const resumeInfo = response.data.resume || response.data;
        setResumeData(resumeInfo);
        showSuccessToast('Resume loaded successfully!');
      } else {
        setError('Resume not found');
      }
    } catch (error) {
      console.error('Error fetching shared resume:', error);
      setError('Failed to load resume. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (shareType === 'edit') {
      setIsEditing(true);
      // Navigate to edit mode with the shared resume
      navigate(`/resumes/${resumeId}?shared=true&token=${token}`);
    } else {
      showErrorToast('You do not have edit permissions for this resume');
    }
  };

  const handleDownload = async () => {
    try {
      showSuccessToast('Preparing download...');
      // Implement PDF download logic here
      // This would be similar to the download functionality in EditResume
    } catch (error) {
      showErrorToast('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Resume info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Share2 className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {resumeData?.title || 'Shared Resume'}
                </h1>
                <p className="text-sm text-gray-600">
                  {shareType === 'edit' ? 'View & Edit Access' : 'View Only Access'}
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </button>
              
              {shareType === 'edit' && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit Resume</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Permission Banner */}
          <div className={`px-6 py-4 border-b ${
            shareType === 'edit' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              {shareType === 'edit' ? (
                <>
                  <Edit className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-800">Edit Access Granted</p>
                    <p className="text-sm text-green-600">You can view, edit, and download this resume</p>
                  </div>
                </>
              ) : (
                <>
                  <Eye className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-blue-800">View Access</p>
                    <p className="text-sm text-blue-600">You can view and download this resume</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="p-6">
            {resumeData ? (
              <div className="max-w-4xl mx-auto">
                <LivePreview
                  resumeData={resumeData}
                  templateId={resumeData.template?.id || '01'}
                  colorPalette={resumeData.template?.colorPalette}
                  colorTheme={resumeData.template?.theme}
                  containerWidth={800}
                  showControls={false}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No resume data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by AI Resume Builder
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Create your own resume →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedResume;
