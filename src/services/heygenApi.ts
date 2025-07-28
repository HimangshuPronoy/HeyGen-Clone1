// HeyGen API Service
// Note: You need to replace this with your actual HeyGen API key
// Get your API key from: https://app.heygen.com/settings/api
const API_BASE_URL = 'https://api.heygen.com/v2';
const API_KEY = import.meta.env.VITE_HEYGEN_API_KEY || 'MDJkYjE2ZTA2OWE0NDYyN2FjN2YwM2IxYzY2OTY5YjYtMTc1MzY4MDc0OQ==';

class HeyGenApiService {
  async testApiConnection() {
    try {
      console.log('Testing HeyGen API connection...');
      console.log('API Key (first 10 chars):', API_KEY.substring(0, 10) + '...');
      const response = await this.request<any>('/user/info');
      console.log('API connection successful:', response);
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Api-Key': API_KEY, // HeyGen uses X-Api-Key header
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorData
      });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAvatars() {
    try {
      console.log('Fetching avatars from HeyGen API...');
      const response = await this.request<any>('/avatar/list');
      console.log('Avatar response:', response);
      return response.data?.avatars || response.avatars || [];
    } catch (error) {
      console.error('Error fetching avatars:', error);
      console.log('Falling back to mock avatars');
      // Return mock data for development
      return this.getMockAvatars();
    }
  }

  async generateVideo(data: {
    avatar_id: string;
    text: string;
    voice_id?: string;
  }) {
    try {
      const requestBody = {
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: data.avatar_id,
            scale: 1,
          },
          voice: {
            type: 'text',
            input_text: data.text,
            voice_id: data.voice_id || 'en_us_001', // Default voice if none provided
          },
        }],
        dimension: {
          width: 1920,
          height: 1080,
        },
        aspect_ratio: '16:9',
        test: false, // Set to true for testing
      };

      console.log('Generating video with payload:', requestBody);

      const response = await this.request<any>('/video/generate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      
      return response.data || response;
    } catch (error) {
      console.error('Error generating video:', error);
      // Return mock response for development
      return {
        video_id: `mock_${Date.now()}`,
        status: 'processing'
      };
    }
  }

  async getVideoStatus(videoId: string) {
    try {
      const response = await this.request<any>(`/video/${videoId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error getting video status:', error);
      // Return mock completed status after 3 seconds for development
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 'completed',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
          });
        }, 3000);
      });
    }
  }

  async getVoices() {
    try {
      console.log('Fetching voices from HeyGen API...');
      const response = await this.request<any>('/voice/list');
      console.log('Voice response:', response);
      return response.data?.voices || response.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      console.log('Falling back to mock voices');
      // Return mock voices for development
      return [
        { voice_id: 'en_us_001', name: 'English US - Female' },
        { voice_id: 'en_us_002', name: 'English US - Male' },
        { voice_id: 'en_us_003', name: 'English US - Female 2' },
      ];
    }
  }

  private getMockAvatars() {
    return [
      {
        id: 'avatar_1',
        name: 'Sarah Chen',
        preview_image_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'female',
        age_group: 'young_adult',
        ethnicity: 'asian',
        language: 'english'
      },
      {
        id: 'avatar_2', 
        name: 'Marcus Johnson',
        preview_image_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'male',
        age_group: 'adult',
        ethnicity: 'african_american',
        language: 'english'
      },
      {
        id: 'avatar_3',
        name: 'Emma Rodriguez',
        preview_image_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'female',
        age_group: 'young_adult', 
        ethnicity: 'hispanic',
        language: 'english'
      },
      {
        id: 'avatar_4',
        name: 'David Kim',
        preview_image_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'male',
        age_group: 'adult',
        ethnicity: 'asian',
        language: 'english'
      },
      {
        id: 'avatar_5',
        name: 'Olivia Thompson',
        preview_image_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'female',
        age_group: 'adult',
        ethnicity: 'caucasian',
        language: 'english'
      },
      {
        id: 'avatar_6',
        name: 'Ahmed Hassan',
        preview_image_url: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'male',
        age_group: 'adult',
        ethnicity: 'middle_eastern',
        language: 'english'
      }
    ];
  }
}

export const heygenApi = new HeyGenApiService();