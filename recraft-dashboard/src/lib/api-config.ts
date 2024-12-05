import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  isDevelopment 
    ? 'http://localhost:3000/api/v1'
    : 'https://api.your-domain.com/api/v1'
);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});