import express from 'express';
import { createLesson, getMyLessons, completeLesson, deleteLesson } from '../controllers/lessonController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createLesson)
  .get(protect, getMyLessons);

router.route('/:id')
  .delete(protect, deleteLesson);

router.put('/:id/complete', protect, completeLesson);

export default router;