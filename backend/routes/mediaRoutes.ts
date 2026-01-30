import express from 'express';
import { getUploadSignature } from '../controllers/mediaController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/signature', protect, getUploadSignature);

export default router;