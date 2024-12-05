import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { RecraftService, recraftService } from '../services/recraft.service';

// Helper function to ensure file type safety
const getUploadedFile = (files: any): UploadedFile | undefined => {
  if (!files || !files.file) return undefined;
  return Array.isArray(files.file) ? files.file[0] : files.file;
};

const getUploadedFiles = (files: any): UploadedFile[] => {
  if (!files) return [];
  return Object.values(files).flat() as UploadedFile[];
};

// Factory functions for controllers with dependency injection
export const createGenerateImageController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const result = await service.generateImage(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

export const createVectorizeController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const file = getUploadedFile(req.files);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const result = await service.vectorizeImage({
        file,
        response_format: req.body.response_format
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

export const createRemoveBackgroundController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const file = getUploadedFile(req.files);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const result = await service.removeBackground({
        file,
        response_format: req.body.response_format
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

export const createClarityUpscaleController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const file = getUploadedFile(req.files);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const result = await service.clarityUpscale({
        file,
        response_format: req.body.response_format
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

export const createGenerativeUpscaleController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const file = getUploadedFile(req.files);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const result = await service.generativeUpscale({
        file,
        response_format: req.body.response_format
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

export const createStyleController = (service: RecraftService) => {
  return async (req: Request, res: Response) => {
    try {
      const files = getUploadedFiles(req.files);
      if (files.length === 0) {
        return res.status(400).json({ error: 'At least one file is required' });
      }

      const result = await service.createStyle({
        style: req.body.style,
        files
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

// Export default instances for normal use
export const generateImage = createGenerateImageController(recraftService);
export const vectorizeImage = createVectorizeController(recraftService);
export const removeBackground = createRemoveBackgroundController(recraftService);
export const clarityUpscale = createClarityUpscaleController(recraftService);
export const generativeUpscale = createGenerativeUpscaleController(recraftService);
export const createStyle = createStyleController(recraftService); 