export const mockGenerateImageResponse = {
  data: [
    {
      url: 'https://mock-image-url.com/test.jpg',
      id: 'mock-id-123',
    }
  ]
};

export const mockImageProcessingResponse = {
  image: {
    url: 'https://mock-image-url.com/processed.png',
    id: 'mock-process-123'
  }
};

export const mockStyleResponse = {
  style: {
    id: 'mock-style-123',
    name: 'Test Style',
    status: 'ready'
  }
};

export const mockApiError = {
  error: 'Something went wrong',
  type: 'api_error'
};

export const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

export const mockGenerateImageParams = {
  prompt: 'test image',
  model: 'recraftv3',
  response_format: 'url',
  size: '1024x1024'
};

export const mockFileUploadParams = {
  file: mockFile,
  response_format: 'url'
};

export const mockCreateStyleParams = {
  style: 'Test Style',
  files: [mockFile, mockFile]
}; 