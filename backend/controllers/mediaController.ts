import { Request, Response } from 'express';
import { generateCloudinarySignature } from '../services/mediaService';

// @desc    Get signature for client-side upload
// @route   GET /api/media/signature
// @access  Private
export const getUploadSignature = (req: any, res: any) => {
  try {
    const signatureData = generateCloudinarySignature();
    res.json(signatureData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating signature' });
  }
};