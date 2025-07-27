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
    <div className="bg-white/80 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl backdrop-blur-md animate-fade-in-up">
      <div className="aspect-[9/16] relative">
        <video
          controls
          className="w-full h-full object-cover rounded-b-none"
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-gray-900 mb-2 drop-shadow">Video Ready!</h3>
        <p className="text-gray-600 text-sm mb-4">Your AI avatar video is ready to download and share.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg text-base"
          >
            <Download className="w-5 h-5" />
            Download Video
          </button>
          <button
            onClick={handleCopyLinkAsync}
            className="w-full px-4 py-3 bg-white/80 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2 font-bold border border-blue-100 shadow text-base"
          >
            Copy Link
          </button>
          <button
            onClick={onReset}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2 font-bold shadow text-base"
          >
            <RotateCcw className="w-5 h-5" />
            Create New Video
          </button>
        </div>
      </div>
    </div>
  );
};