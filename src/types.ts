export interface Avatar {
  id: string;
  name: string;
  preview_image_url: string;
  gender: string;
  age_group: string;
  ethnicity: string;
  language: string;
}

export interface VideoGenerationRequest {
  avatar_id: string;
  text: string;
  voice_id?: string;
  voice_settings?: {
    speed: number;
    pitch: number;
  };
}

export interface Video {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  thumbnail_url?: string;
  created_at: string;
  duration?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}