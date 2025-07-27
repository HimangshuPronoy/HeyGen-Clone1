import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AvatarCard } from './components/AvatarCard';
import { TextInput } from './components/TextInput';
import { VideoPreview } from './components/VideoPreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { heygenApi } from './services/heygenApi';
import { Avatar } from './types';
import { Video, Users, ArrowLeft } from 'lucide-react';

interface GeneratedVideo {
  id: string;
  status: string;
  video_url?: string;
  thumbnail_url?: string;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGetStarted = () => {
    setShowLanding(false);
    loadAvatars();
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setGeneratedVideo(null);
    setScript('');
    setSelectedAvatar(null);
    setProgress(0);
  };

  useEffect(() => {
    // Don't auto-load avatars on mount
  }, []);

  const loadAvatars = async () => {
    setIsLoading(true);
    try {
      const fetchedAvatars = await heygenApi.getAvatars();
      setAvatars(fetchedAvatars);
    } catch (error) {
      console.error('Failed to load avatars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!selectedAvatar || !script.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await heygenApi.generateVideo({
        avatar_id: selectedAvatar.id,
        text: script,
      });

      // Check if we got a mock response and handle it
      if (response.video_id.startsWith('mock_')) {
        throw new Error('API request failed, using mock data');
      }

      // Poll for video completion
      const videoId = response.video_id;
      let attempts = 0;
      const maxAttempts = 20;
      
      const pollStatus = async (): Promise<void> => {
        attempts++;
        const status = await heygenApi.getVideoStatus(videoId);
        
        if (status.status === 'completed') {
          clearInterval(progressInterval);
          setProgress(100);
          setGeneratedVideo({
            id: videoId,
            status: status.status,
            video_url: status.video_url,
            thumbnail_url: status.thumbnail_url,
          });
          setIsGenerating(false);
        } else if (status.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(progressInterval);
          throw new Error('Video generation failed');
        } else {
          setTimeout(pollStatus, 2000);
        }
      };

      await pollStatus();
    } catch (error) {
      console.error('Failed to generate video:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const resetVideo = () => {
    setGeneratedVideo(null);
    setScript('');
    setSelectedAvatar(null);
    setProgress(0);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading avatars..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToLanding}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Video Studio</h1>
                <p className="text-sm text-gray-600">Create professional videos with AI avatars</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Video Preview */}
        <div className="flex-1 p-6 flex items-center justify-center">
          {generatedVideo ? (
            <VideoPreview
              videoUrl={generatedVideo.video_url!}
              thumbnailUrl={generatedVideo.thumbnail_url}
              onReset={resetVideo}
            />
          ) : isGenerating ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <LoadingSpinner 
                message="Generating your AI video..." 
                progress={progress}
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your video will appear here</h3>
              <p className="text-gray-600">Select an avatar and enter your script to get started</p>
            </div>
          )}
        </div>

        {/* Right Panel - Avatar Selection and Script */}
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
          {/* Avatar Selection */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Choose Avatar</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatar?.id === avatar.id}
                  onSelect={setSelectedAvatar}
                />
              ))}
            </div>
          </div>

          {/* Script Input */}
          <div className="border-t border-gray-200 p-6">
            <TextInput
              value={script}
              onChange={setScript}
              onGenerate={generateVideo}
              isGenerating={isGenerating}
              selectedAvatar={selectedAvatar}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;