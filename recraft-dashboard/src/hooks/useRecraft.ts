import { useState, useCallback } from 'react';
import { recraftService } from '../services/recraft.service';
import type {
  ImageGenerationResponse,
  ImageProcessingResponse,
  StyleResponse,
  GenerateImageParams,
  FileUploadParams,
  CreateStyleParams,
  ApiError,
} from '../types/api.types';

interface UseRecraftState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

export function useRecraft() {
  const [generateState, setGenerateState] = useState<UseRecraftState<ImageGenerationResponse>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const [processState, setProcessState] = useState<UseRecraftState<ImageProcessingResponse>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const [styleState, setStyleState] = useState<UseRecraftState<StyleResponse>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const generateImage = useCallback(async (params: GenerateImageParams) => {
    setGenerateState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.generateImage(params);
      setGenerateState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setGenerateState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  const vectorizeImage = useCallback(async (params: FileUploadParams) => {
    setProcessState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.vectorizeImage(params);
      setProcessState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setProcessState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  const removeBackground = useCallback(async (params: FileUploadParams) => {
    setProcessState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.removeBackground(params);
      setProcessState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setProcessState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  const clarityUpscale = useCallback(async (params: FileUploadParams) => {
    setProcessState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.clarityUpscale(params);
      setProcessState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setProcessState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  const generativeUpscale = useCallback(async (params: FileUploadParams) => {
    setProcessState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.generativeUpscale(params);
      setProcessState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setProcessState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  const createStyle = useCallback(async (params: CreateStyleParams) => {
    setStyleState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await recraftService.createStyle(params);
      setStyleState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setStyleState({ data: null, error: apiError, isLoading: false });
      throw error;
    }
  }, []);

  return {
    generateImage,
    vectorizeImage,
    removeBackground,
    clarityUpscale,
    generativeUpscale,
    createStyle,
    generateState,
    processState,
    styleState,
  };
} 