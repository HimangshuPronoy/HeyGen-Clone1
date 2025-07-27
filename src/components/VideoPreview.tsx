import React from 'react';
import { Download, Play, RotateCcw } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  thumbnailUrl?: string;
  onReset: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  thumbnailUrl,
  onReset,
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `heygen-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
  };

  const handleCopyLinkAsync = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      // You could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = videoUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <div className="aspect-[9/16] relative">
        <video
          controls
          className="w-full h-full object-cover"
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Video Ready!
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Your AI avatar video is ready to download and share.
        </p>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Download Video
          </button>
          
          <button
            onClick={handleCopyLinkAsync}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
          >
            Copy Link
          </button>
          
          <button
            onClick={onReset}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Create New Video
          </button>
        </div>
      </div>
    </div>
  );
};