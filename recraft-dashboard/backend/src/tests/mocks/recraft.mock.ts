export const mockGenerateImageResponse = {
  data: [
    {
      url: 'https://mock-image-url.com/test.jpg',
      id: 'mock-id-123',
    }
  ]
};

export const mockVectorizeResponse = {
  image: {
    url: 'https://mock-image-url.com/vectorized.svg',
    id: 'mock-vector-123'
  }
};

export const mockRemoveBackgroundResponse = {
  image: {
    url: 'https://mock-image-url.com/no-bg.png',
    id: 'mock-nobg-123'
  }
};

export const mockClarityUpscaleResponse = {
  image: {
    url: 'https://mock-image-url.com/upscaled.png',
    id: 'mock-upscale-123'
  }
};

export const mockGenerativeUpscaleResponse = {
  image: {
    url: 'https://mock-image-url.com/gen-upscaled.png',
    id: 'mock-gen-upscale-123'
  }
};

export const mockStyleResponse = {
  style: {
    id: 'mock-style-123',
    name: 'Test Style',
    status: 'ready'
  }
};

export const mockErrorResponse = {
  error: {
    message: 'Invalid model specified',
    type: 'invalid_request_error',
  }
};

export const mockFileValidationError = {
  error: {
    message: 'File is required',
    type: 'validation_error',
  }
}; 