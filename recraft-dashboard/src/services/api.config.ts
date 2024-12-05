import axios from 'axios';
import type { ApiError } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: unknown): Promise<never> => {
    let apiError: ApiError;

    if (error && typeof error === 'object' && 'response' in error) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const axiosError = error as { response?: { data?: ApiError } };
      apiError = axiosError.response?.data || { error: 'Unknown server error' };
    } else if (error && typeof error === 'object' && 'request' in error) {
      // The request was made but no response was received
      apiError = { error: 'No response from server' };
    } else {
      // Something happened in setting up the request that triggered an Error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      apiError = { error: errorMessage };
    }

    return Promise.reject(apiError);
  }
); 