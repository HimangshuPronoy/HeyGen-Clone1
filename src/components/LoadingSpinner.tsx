import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Processing...',
  progress,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      
      {/* Message */}
      <p className="text-gray-900 text-lg font-medium mb-4 text-center">
        {message}
      </p>
      
      {/* Progress Bar */}
      {typeof progress === 'number' && (
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
      
      {typeof progress === 'number' && (
        <p className="text-gray-600 text-sm">
          {Math.round(progress)}% complete
        </p>
      )}
    </div>
  );
};