import { Router } from 'express';
import fileUpload from 'express-fileupload';
import * as recraftController from '../controllers/recraft.controller';
import { validateImageGeneration, validateFileUpload, validateStyleCreation } from '../middleware/validation.middleware';

const router = Router();

// File upload middleware
router.use(fileUpload());

// Image generation endpoint
router.post('/images/generations', 
  validateImageGeneration,
  recraftController.generateImage
);

// Image vectorization endpoint
router.post('/images/vectorize',
  validateFileUpload,
  recraftController.vectorizeImage
);

// Background removal endpoint
router.post('/images/removeBackground',
  validateFileUpload,
  recraftController.removeBackground
);

// Clarity upscale endpoint
router.post('/images/clarityUpscale',
  validateFileUpload,
  recraftController.clarityUpscale
);

// Generative upscale endpoint
router.post('/images/generativeUpscale',
  validateFileUpload,
  recraftController.generativeUpscale
);

// Style creation endpoint
router.post('/styles',
  validateStyleCreation,
  recraftController.createStyle
);

export default router; 