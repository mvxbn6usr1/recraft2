export interface ImageGenerationResponse {
  data: Array<{
    url: string;
    id: string;
  }>;
}

export interface ImageProcessingResponse {
  image: {
    url: string;
    id: string;
  };
}

export interface StyleResponse {
  style: {
    id: string;
    name: string;
    status: string;
  };
}

export interface ApiError {
  error: string;
  type?: string;
}

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  response_format?: string;
  size?: string;
  style?: string;
  style_id?: string;
  substyle?: string;
}

export interface FileUploadParams {
  file: File;
  response_format?: string;
}

export interface CreateStyleParams {
  style: string;
  files: File[];
} 