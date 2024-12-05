import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

export const config = {
  recraftApi: {
    baseUrl: 'https://external.api.recraft.ai/v1',
    token: process.env.RECRAFT_API_TOKEN,
  },
  server: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
        'http://localhost:5173',
        'http://localhost:5174',
      ],
      credentials: true,
    },
  },
};

// Validate required environment variables
if (!config.recraftApi.token) {
  throw new Error('RECRAFT_API_TOKEN is required');
}

export default config; 