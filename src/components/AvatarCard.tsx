import React from 'react';
import { Avatar } from '../types';
import { User } from 'lucide-react';

interface AvatarCardProps {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: (avatar: Avatar) => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-blue-500' 
          : 'hover:ring-2 hover:ring-gray-300'
        }
        rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md
      `}
      onClick={() => onSelect(avatar)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={avatar.preview_image_url}
          alt={avatar.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgdmlld0JveD0iMCAwIDQwMCA1MzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTMzIiBmaWxsPSIjMUUyOTNCIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTEwMCAzNTBDMTAwIDMwMCAxNDUgMjUwIDIwMCAyNTBTMzAwIDMwMCAzMDAgMzUwVjQ1MEgxMDBWMzUwWiIgZmlsbD0iIzYzNjZGMSIvPgo8L3N2Zz4K';
          }}
        />
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
        
        {/* Gender Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white font-medium">
          <User className="w-3 h-3 inline mr-1" />
          {avatar.gender}
        </div>
      </div>
      
      {/* Avatar Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {avatar.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="capitalize">{avatar.ethnicity?.replace('_', ' ')}</span>
          <span>•</span>
          <span className="capitalize">{avatar.age_group?.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};