import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { UploadedFile } from 'express-fileupload';
import config from '../config/recraft.config';
import { RecraftService } from '../services/recraft.service';
import * as controllers from '../controllers/recraft.controller';
import { validateImageGeneration, validateFileUpload, validateStyleCreation } from '../middleware/validation.middleware';
import {
  mockGenerateImageResponse,
  mockVectorizeResponse,
  mockRemoveBackgroundResponse,
  mockClarityUpscaleResponse,
  mockGenerativeUpscaleResponse,
  mockStyleResponse,
  mockErrorResponse,
  mockFileValidationError
} from './mocks/recraft.mock';

// Create a mock instance
const mockAxiosInstance = {
  post: jest.fn(),
  create: jest.fn(),
} as any;

// Create service with mock instance
const mockRecraftService = new RecraftService(mockAxiosInstance);

// Create test router with mock service
const createTestRouter = () => {
  const router = Router();
  
  router.use(fileUpload());

  // Image generation endpoint
  router.post('/images/generations',
    validateImageGeneration,
    controllers.createGenerateImageController(mockRecraftService)
  );

  // Image vectorization endpoint
  router.post('/images/vectorize',
    validateFileUpload,
    controllers.createVectorizeController(mockRecraftService)
  );

  // Background removal endpoint
  router.post('/images/removeBackground',
    validateFileUpload,
    controllers.createRemoveBackgroundController(mockRecraftService)
  );

  // Clarity upscale endpoint
  router.post('/images/clarityUpscale',
    validateFileUpload,
    controllers.createClarityUpscaleController(mockRecraftService)
  );

  // Generative upscale endpoint
  router.post('/images/generativeUpscale',
    validateFileUpload,
    controllers.createGenerativeUpscaleController(mockRecraftService)
  );

  // Style creation endpoint
  router.post('/styles',
    validateStyleCreation,
    controllers.createStyleController(mockRecraftService)
  );

  return router;
};

const app = express();
app.use(express.json());
app.use(cors(config.server.cors));
app.use('/api/v1', createTestRouter());

describe('Recraft API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance.post.mockReset();
  });

  describe('POST /api/v1/images/generations', () => {
    it('should generate an image', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockGenerateImageResponse });

      const response = await request(app)
        .post('/api/v1/images/generations')
        .send({
          prompt: 'test image',
          model: 'recraftv3',
          response_format: 'url',
          size: '1024x1024'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGenerateImageResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/images/generations', {
        prompt: 'test image',
        model: 'recraftv3',
        response_format: 'url',
        size: '1024x1024'
      });
    });

    it('should return 400 for missing prompt', async () => {
      const response = await request(app)
        .post('/api/v1/images/generations')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Prompt is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/images/vectorize', () => {
    const testFile = Buffer.from('test image data');

    it('should vectorize an image', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockVectorizeResponse });

      const response = await request(app)
        .post('/api/v1/images/vectorize')
        .attach('file', testFile, { filename: 'test.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVectorizeResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it('should return 400 for missing file', async () => {
      const response = await request(app)
        .post('/api/v1/images/vectorize')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('File is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/images/removeBackground', () => {
    const testFile = Buffer.from('test image data');

    it('should remove background from an image', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockRemoveBackgroundResponse });

      const response = await request(app)
        .post('/api/v1/images/removeBackground')
        .attach('file', testFile, { filename: 'test.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRemoveBackgroundResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it('should return 400 for missing file', async () => {
      const response = await request(app)
        .post('/api/v1/images/removeBackground')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('File is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/images/clarityUpscale', () => {
    const testFile = Buffer.from('test image data');

    it('should upscale an image with clarity', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockClarityUpscaleResponse });

      const response = await request(app)
        .post('/api/v1/images/clarityUpscale')
        .attach('file', testFile, { filename: 'test.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClarityUpscaleResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it('should return 400 for missing file', async () => {
      const response = await request(app)
        .post('/api/v1/images/clarityUpscale')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('File is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/images/generativeUpscale', () => {
    const testFile = Buffer.from('test image data');

    it('should upscale an image generatively', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockGenerativeUpscaleResponse });

      const response = await request(app)
        .post('/api/v1/images/generativeUpscale')
        .attach('file', testFile, { filename: 'test.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGenerativeUpscaleResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it('should return 400 for missing file', async () => {
      const response = await request(app)
        .post('/api/v1/images/generativeUpscale')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('File is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/styles', () => {
    const testFile = Buffer.from('test image data');

    it('should create a style', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockStyleResponse });

      const response = await request(app)
        .post('/api/v1/styles')
        .field('style', 'Test Style')
        .attach('file1', testFile, { filename: 'test1.png', contentType: 'image/png' })
        .attach('file2', testFile, { filename: 'test2.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStyleResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it('should return 400 for missing style name', async () => {
      const response = await request(app)
        .post('/api/v1/styles')
        .attach('file1', testFile, { filename: 'test1.png', contentType: 'image/png' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Style name is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('should return 400 for missing files', async () => {
      const response = await request(app)
        .post('/api/v1/styles')
        .field('style', 'Test Style');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('At least one file is required');
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });
}); 