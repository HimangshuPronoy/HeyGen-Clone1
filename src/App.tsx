import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AvatarCard } from './components/AvatarCard';
import { TextInput } from './components/TextInput';
import { VideoPreview } from './components/VideoPreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { heygenApi } from './services/heygenApi';
import { Avatar } from './types';
import { Video, Users, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from './components/AnimatedBackground';

interface GeneratedVideo {
  id: string;
  status: string;
  video_url?: string;
  thumbnail_url?: string;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGetStarted = () => {
    setShowLanding(false);
    loadAvatarsAndVoices();
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

  const loadAvatarsAndVoices = async () => {
    setIsLoading(true);
    try {
      const [fetchedAvatars, fetchedVoices] = await Promise.all([
        heygenApi.getAvatars(),
        heygenApi.getVoices(),
      ]);
      setAvatars(fetchedAvatars);
      setVoices(fetchedVoices);
    } catch (error) {
      console.error('Failed to load avatars or voices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!selectedAvatar || !script.trim()) return;
    
    // Check if API key is configured
    if (import.meta.env.VITE_HEYGEN_API_KEY === 'your-api-key-here' || !import.meta.env.VITE_HEYGEN_API_KEY) {
      alert('Please configure your HeyGen API key in the .env file. See README.md for instructions.');
      return;
    }
    
    const voice_id = voices[0]?.voice_id;
    if (!voice_id) {
      alert('No voices available.');
      return;
    }
    
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
        voice_id,
      });
      
      // Check if we got a mock response and handle it
      if (response.video_id.startsWith('mock_')) {
        clearInterval(progressInterval);
        setProgress(100);
        setGeneratedVideo({
          id: response.video_id,
          status: 'completed',
          video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
        });
        setIsGenerating(false);
        return;
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
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          alert('Invalid API key. Please check your HeyGen API key configuration.');
        } else if (error.message.includes('404')) {
          alert('API endpoint not found. Please check your internet connection and try again.');
        } else if (error.message.includes('400')) {
          alert('Invalid request. Please check your input and try again.');
        } else {
          alert(`Error: ${error.message}`);
        }
      }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <LoadingSpinner message="Loading avatars..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white relative overflow-hidden">
      <AnimatedBackground />
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/60 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToLanding}
                className="w-10 h-10 bg-white/70 hover:bg-white/90 rounded-lg flex items-center justify-center transition-colors mr-2 shadow-md border border-gray-200 backdrop-blur-md"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">HeyGen Studio</h1>
                <p className="text-sm text-gray-600 font-medium">Create stunning AI avatar videos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Avatars */}
        <aside className="w-80 bg-white/60 backdrop-blur-lg border-r border-gray-200 flex flex-col p-0 shadow-xl relative z-10">
          <div className="p-6 pb-2 flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-md z-20">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Choose Avatar</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 custom-scrollbar">
            <div className="flex flex-col gap-4">
              {avatars.map((avatar, idx) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatar?.id === avatar.id}
                  onSelect={setSelectedAvatar}
                  featured={idx === 0} // Add a featured badge to the first avatar for wow
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Area - Video Preview & Script */}
        <section className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
          <div className="w-full max-w-2xl mx-auto">
            {generatedVideo ? (
              <VideoPreview
                videoUrl={generatedVideo.video_url!}
                thumbnailUrl={generatedVideo.thumbnail_url}
                onReset={resetVideo}
              />
            ) : isGenerating ? (
              <div className="bg-white/80 rounded-2xl p-12 border border-gray-200 shadow-2xl flex flex-col items-center justify-center">
                <LoadingSpinner 
                  message="Generating your AI video..." 
                  progress={progress}
                />
              </div>
            ) : (
              <div className="text-center animate-fade-in-up">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-200">
                  <Video className="w-16 h-16 text-blue-400 opacity-60" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 drop-shadow">Your video will appear here</h3>
                <p className="text-gray-600 text-lg">Select an avatar and enter your script to get started</p>
              </div>
            )}
          </div>
          <div className="w-full max-w-2xl mx-auto mt-10">
            <TextInput
              value={script}
              onChange={setScript}
              onGenerate={generateVideo}
              isGenerating={isGenerating}
              selectedAvatar={selectedAvatar}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;