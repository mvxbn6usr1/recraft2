import { Request, Response, NextFunction } from 'express';

export const validateImageGeneration = (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  next();
};

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files?.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  next();
};

export const validateStyleCreation = (req: Request, res: Response, next: NextFunction) => {
  const { style } = req.body;
  const files = req.files;

  if (!style) {
    return res.status(400).json({ error: 'Style name is required' });
  }

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ error: 'At least one file is required' });
  }

  next();
}; 