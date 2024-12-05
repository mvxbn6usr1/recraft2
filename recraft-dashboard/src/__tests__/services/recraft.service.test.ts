import { vi } from 'vitest';
import { api } from '../../services/api.config';
import { recraftService } from '../../services/recraft.service';
import {
  mockGenerateImageResponse,
  mockImageProcessingResponse,
  mockStyleResponse,
  mockApiError,
  mockGenerateImageParams,
  mockFileUploadParams,
  mockCreateStyleParams,
} from '../mocks/api.mock';

// Mock the API
vi.mock('../../services/api.config', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('RecraftService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateImage', () => {
    it('should generate an image successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockGenerateImageResponse });

      const result = await recraftService.generateImage(mockGenerateImageParams);

      expect(result).toEqual(mockGenerateImageResponse);
      expect(api.post).toHaveBeenCalledWith('/images/generations', mockGenerateImageParams);
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.generateImage(mockGenerateImageParams))
        .rejects.toEqual(mockApiError);
    });
  });

  describe('vectorizeImage', () => {
    it('should vectorize an image successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockImageProcessingResponse });

      const result = await recraftService.vectorizeImage(mockFileUploadParams);

      expect(result).toEqual(mockImageProcessingResponse);
      expect(api.post).toHaveBeenCalledWith(
        '/images/vectorize',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.vectorizeImage(mockFileUploadParams))
        .rejects.toEqual(mockApiError);
    });
  });

  describe('removeBackground', () => {
    it('should remove background successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockImageProcessingResponse });

      const result = await recraftService.removeBackground(mockFileUploadParams);

      expect(result).toEqual(mockImageProcessingResponse);
      expect(api.post).toHaveBeenCalledWith(
        '/images/removeBackground',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.removeBackground(mockFileUploadParams))
        .rejects.toEqual(mockApiError);
    });
  });

  describe('clarityUpscale', () => {
    it('should upscale image with clarity successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockImageProcessingResponse });

      const result = await recraftService.clarityUpscale(mockFileUploadParams);

      expect(result).toEqual(mockImageProcessingResponse);
      expect(api.post).toHaveBeenCalledWith(
        '/images/clarityUpscale',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.clarityUpscale(mockFileUploadParams))
        .rejects.toEqual(mockApiError);
    });
  });

  describe('generativeUpscale', () => {
    it('should upscale image generatively successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockImageProcessingResponse });

      const result = await recraftService.generativeUpscale(mockFileUploadParams);

      expect(result).toEqual(mockImageProcessingResponse);
      expect(api.post).toHaveBeenCalledWith(
        '/images/generativeUpscale',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.generativeUpscale(mockFileUploadParams))
        .rejects.toEqual(mockApiError);
    });
  });

  describe('createStyle', () => {
    it('should create style successfully', async () => {
      (api.post as any).mockResolvedValueOnce({ data: mockStyleResponse });

      const result = await recraftService.createStyle(mockCreateStyleParams);

      expect(result).toEqual(mockStyleResponse);
      expect(api.post).toHaveBeenCalledWith(
        '/styles',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });

    it('should handle errors', async () => {
      (api.post as any).mockRejectedValueOnce(mockApiError);

      await expect(recraftService.createStyle(mockCreateStyleParams))
        .rejects.toEqual(mockApiError);
    });
  });
}); 