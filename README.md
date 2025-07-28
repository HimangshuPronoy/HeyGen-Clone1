# Ad UGC Maker - HeyGen Integration

A React application for creating AI-generated avatar videos using the HeyGen API.

## Setup

### 1. Get Your HeyGen API Key

1. Go to [HeyGen App](https://app.heygen.com/settings/api)
2. Sign up or log in to your account
3. Navigate to Settings > API
4. Generate a new API key
5. Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# HeyGen API Configuration
VITE_HEYGEN_API_KEY=your-actual-api-key-here
```

Replace `your-actual-api-key-here` with your actual HeyGen API key.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## Features

- Choose from a variety of AI avatars
- Generate videos with custom text-to-speech
- Real-time video generation status
- Modern, responsive UI
- Fallback to mock data for development

## API Integration

The app integrates with HeyGen's API for:
- Avatar listing (`/avatar/list`)
- Voice listing (`/voice/list`)
- Video generation (`/video/generate`)
- Video status checking (`/video/{id}`)

## Troubleshooting

### Common Issues

1. **404 Errors**: Make sure you're using the correct API endpoints
2. **400 Errors**: Check that your request payload format is correct
3. **401 Errors**: Verify your API key is valid and properly configured
4. **CORS Issues**: The API should handle CORS, but if you encounter issues, check your browser's network tab

### API Key Issues

If you're getting authentication errors:
1. Verify your API key is correct
2. Make sure the API key has the necessary permissions
3. Check that the API key is not expired
4. Ensure you're using the correct header format (`X-Api-Key`)

## Development

The app includes fallback mock data for development purposes. When the API is not available or returns errors, the app will use mock data to demonstrate the functionality.

## License

This project is for educational and development purposes. 