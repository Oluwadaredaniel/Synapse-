import express from 'express';
import { getUserProfile, updateUserProfile, getLeaderboard } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/leaderboard', getLeaderboard); // Public or Protected

export default router;