import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useRecraft } from '../../hooks/useRecraft';
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

// Mock the service
vi.mock('../../services/recraft.service', () => ({
  recraftService: {
    generateImage: vi.fn(),
    vectorizeImage: vi.fn(),
    removeBackground: vi.fn(),
    clarityUpscale: vi.fn(),
    generativeUpscale: vi.fn(),
    createStyle: vi.fn(),
  },
}));

describe('useRecraft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateImage', () => {
    it('should handle successful image generation', async () => {
      (recraftService.generateImage as any).mockResolvedValueOnce(mockGenerateImageResponse);

      const { result } = renderHook(() => useRecraft());

      expect(result.current.generateState.isLoading).toBe(false);

      let response;
      await act(async () => {
        response = await result.current.generateImage(mockGenerateImageParams);
      });

      expect(response).toEqual(mockGenerateImageResponse);
      expect(result.current.generateState.data).toEqual(mockGenerateImageResponse);
      expect(result.current.generateState.error).toBeNull();
      expect(result.current.generateState.isLoading).toBe(false);
    });

    it('should handle errors in image generation', async () => {
      (recraftService.generateImage as any).mockRejectedValueOnce(mockApiError);

      const { result } = renderHook(() => useRecraft());

      await act(async () => {
        try {
          await result.current.generateImage(mockGenerateImageParams);
        } catch (error) {
          expect(error).toEqual(mockApiError);
        }
      });

      expect(result.current.generateState.data).toBeNull();
      expect(result.current.generateState.error).toEqual(mockApiError);
      expect(result.current.generateState.isLoading).toBe(false);
    });
  });

  describe('vectorizeImage', () => {
    it('should handle successful image vectorization', async () => {
      (recraftService.vectorizeImage as any).mockResolvedValueOnce(mockImageProcessingResponse);

      const { result } = renderHook(() => useRecraft());

      let response;
      await act(async () => {
        response = await result.current.vectorizeImage(mockFileUploadParams);
      });

      expect(response).toEqual(mockImageProcessingResponse);
      expect(result.current.processState.data).toEqual(mockImageProcessingResponse);
      expect(result.current.processState.error).toBeNull();
      expect(result.current.processState.isLoading).toBe(false);
    });

    it('should handle errors in image vectorization', async () => {
      (recraftService.vectorizeImage as any).mockRejectedValueOnce(mockApiError);

      const { result } = renderHook(() => useRecraft());

      await act(async () => {
        try {
          await result.current.vectorizeImage(mockFileUploadParams);
        } catch (error) {
          expect(error).toEqual(mockApiError);
        }
      });

      expect(result.current.processState.data).toBeNull();
      expect(result.current.processState.error).toEqual(mockApiError);
      expect(result.current.processState.isLoading).toBe(false);
    });
  });

  describe('createStyle', () => {
    it('should handle successful style creation', async () => {
      (recraftService.createStyle as any).mockResolvedValueOnce(mockStyleResponse);

      const { result } = renderHook(() => useRecraft());

      let response;
      await act(async () => {
        response = await result.current.createStyle(mockCreateStyleParams);
      });

      expect(response).toEqual(mockStyleResponse);
      expect(result.current.styleState.data).toEqual(mockStyleResponse);
      expect(result.current.styleState.error).toBeNull();
      expect(result.current.styleState.isLoading).toBe(false);
    });

    it('should handle errors in style creation', async () => {
      (recraftService.createStyle as any).mockRejectedValueOnce(mockApiError);

      const { result } = renderHook(() => useRecraft());

      await act(async () => {
        try {
          await result.current.createStyle(mockCreateStyleParams);
        } catch (error) {
          expect(error).toEqual(mockApiError);
        }
      });

      expect(result.current.styleState.data).toBeNull();
      expect(result.current.styleState.error).toEqual(mockApiError);
      expect(result.current.styleState.isLoading).toBe(false);
    });
  });
}); 