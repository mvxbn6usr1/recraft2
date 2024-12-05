import { api } from './api.config';
import type {
  ImageGenerationResponse,
  ImageProcessingResponse,
  StyleResponse,
  GenerateImageParams,
  FileUploadParams,
  CreateStyleParams,
} from '../types/api.types';

class RecraftService {
  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResponse> {
    const response = await api.post<ImageGenerationResponse>('/images/generations', params);
    return response.data;
  }

  async vectorizeImage(params: FileUploadParams): Promise<ImageProcessingResponse> {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.response_format) {
      formData.append('response_format', params.response_format);
    }

    const response = await api.post<ImageProcessingResponse>('/images/vectorize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async removeBackground(params: FileUploadParams): Promise<ImageProcessingResponse> {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.response_format) {
      formData.append('response_format', params.response_format);
    }

    const response = await api.post<ImageProcessingResponse>('/images/removeBackground', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async clarityUpscale(params: FileUploadParams): Promise<ImageProcessingResponse> {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.response_format) {
      formData.append('response_format', params.response_format);
    }

    const response = await api.post<ImageProcessingResponse>('/images/clarityUpscale', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async generativeUpscale(params: FileUploadParams): Promise<ImageProcessingResponse> {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.response_format) {
      formData.append('response_format', params.response_format);
    }

    const response = await api.post<ImageProcessingResponse>('/images/generativeUpscale', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async createStyle(params: CreateStyleParams): Promise<StyleResponse> {
    const formData = new FormData();
    formData.append('style', params.style);
    params.files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    const response = await api.post<StyleResponse>('/styles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const recraftService = new RecraftService(); 