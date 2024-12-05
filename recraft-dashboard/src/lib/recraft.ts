import axios from 'axios';
import type { 
  RecraftGenerateParams, 
  RecraftResponse,
  FileUploadParams, 
  CreateStyleParams, 
  StyleResponse 
} from '@/types/recraft';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const generateImage = async (params: RecraftGenerateParams): Promise<RecraftResponse> => {
  const response = await api.post<RecraftResponse>('/images/generations', params);
  return response.data;
};

export const vectorizeImage = async (params: FileUploadParams): Promise<RecraftResponse> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.response_format) {
    formData.append('response_format', params.response_format);
  }

  const response = await api.post<RecraftResponse>('/images/vectorize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const removeBackground = async (params: FileUploadParams): Promise<RecraftResponse> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.response_format) {
    formData.append('response_format', params.response_format);
  }

  const response = await api.post<RecraftResponse>('/images/removeBackground', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const clarityUpscale = async (params: FileUploadParams): Promise<RecraftResponse> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.response_format) {
    formData.append('response_format', params.response_format);
  }

  const response = await api.post<RecraftResponse>('/images/clarityUpscale', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const generativeUpscale = async (params: FileUploadParams): Promise<RecraftResponse> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.response_format) {
    formData.append('response_format', params.response_format);
  }

  const response = await api.post<RecraftResponse>('/images/generativeUpscale', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createStyle = async (params: CreateStyleParams): Promise<StyleResponse> => {
  const formData = new FormData();
  formData.append('style', params.style);
  params.files.forEach((file, index) => {
    formData.append(`file${index + 1}`, file);
  });

  const response = await api.post<StyleResponse>('/styles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};