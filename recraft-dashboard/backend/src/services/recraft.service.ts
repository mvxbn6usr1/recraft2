import axios from 'axios';
import { UploadedFile } from 'express-fileupload';
import FormData from 'form-data';
import config from '../config/recraft.config';
import { appendFileToFormData } from '../lib/file-utils';

export interface FileUploadParams {
  file: UploadedFile | Buffer;
  response_format?: string;
}

export interface CreateStyleParams {
  style: string;
  files: (UploadedFile | Buffer)[];
}

interface RecraftErrorResponse {
  error?: {
    message?: string;
  };
}

interface RecraftResponse<T = any> {
  data?: T;
  error?: RecraftErrorResponse;
}

export class RecraftService {
  private api = axios.create({
    baseURL: config.recraftApi.baseUrl,
    headers: {
      'Authorization': `Bearer ${config.recraftApi.token}`,
      'Content-Type': 'application/json',
    },
  });

  async generateImage(params: {
    prompt: string;
    model?: string;
    response_format?: string;
    size?: string;
    style?: string;
    style_id?: string;
    substyle?: string;
  }) {
    try {
      const response = await this.api.post('/images/generations', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to generate image');
    }
  }

  async vectorizeImage(params: FileUploadParams) {
    try {
      const formData = new FormData();
      appendFileToFormData(formData, 'file', params.file);
      if (params.response_format) {
        formData.append('response_format', params.response_format);
      }

      const response = await this.api.post('/images/vectorize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to vectorize image');
    }
  }

  async removeBackground(params: FileUploadParams) {
    try {
      const formData = new FormData();
      appendFileToFormData(formData, 'file', params.file);
      if (params.response_format) {
        formData.append('response_format', params.response_format);
      }

      const response = await this.api.post('/images/removeBackground', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to remove background');
    }
  }

  async clarityUpscale(params: FileUploadParams) {
    try {
      const formData = new FormData();
      appendFileToFormData(formData, 'file', params.file);
      if (params.response_format) {
        formData.append('response_format', params.response_format);
      }

      const response = await this.api.post('/images/clarityUpscale', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to upscale image');
    }
  }

  async generativeUpscale(params: FileUploadParams) {
    try {
      const formData = new FormData();
      appendFileToFormData(formData, 'file', params.file);
      if (params.response_format) {
        formData.append('response_format', params.response_format);
      }

      const response = await this.api.post('/images/generativeUpscale', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to upscale image');
    }
  }

  async createStyle(params: CreateStyleParams) {
    try {
      const formData = new FormData();
      formData.append('style', params.style);
      params.files.forEach((file: UploadedFile | Buffer, index: number) => {
        appendFileToFormData(formData, `file${index + 1}`, file);
      });

      const response = await this.api.post('/styles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create style');
    }
  }

  private handleError(error: unknown, defaultMessage: string): never {
    console.error('Recraft API Error:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: RecraftErrorResponse } }).response;
      console.error('API Response:', response?.data);
      throw new Error(response?.data?.error?.message || defaultMessage);
    }
    throw new Error(defaultMessage);
  }
}

export const recraftService = new RecraftService(); 