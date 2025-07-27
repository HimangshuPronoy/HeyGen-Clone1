import React, { useState } from 'react';
import { MessageSquare, Wand2 } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedAvatar: any;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating,
  selectedAvatar,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const handleGenerate = () => {
    if (value.trim() && selectedAvatar && !isGenerating) {
      onGenerate();
    }
  };

  return (
    <div className="bg-white/80 rounded-2xl p-8 border border-gray-200 shadow-2xl backdrop-blur-md animate-fade-in-up">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-gray-900 mb-1 drop-shadow">Script</h3>
        <p className="text-sm text-gray-600">What should your avatar say?</p>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your script here... Your avatar will speak these words!"
          className={`
            w-full h-40 p-5 bg-gray-50/80 border rounded-2xl text-gray-900 placeholder-gray-400 
            resize-none transition-all duration-300 focus:outline-none
            ${isFocused 
              ? 'border-blue-400 bg-white/90 shadow-xl' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {selectedAvatar ? (
            <span className="text-green-600 font-bold"> ✓ Avatar selected: {selectedAvatar.name}</span>
          ) : (
            <span>Please select an avatar first</span>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={!value.trim() || !selectedAvatar || isGenerating}
          className={`
            px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg text-base
            ${(!value.trim() || !selectedAvatar || isGenerating)
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }
          `}
        >
          <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  );
};