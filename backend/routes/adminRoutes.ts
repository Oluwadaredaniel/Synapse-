import express from 'express';
import { broadcastAnnouncement, getSystemStats } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Middleware to check if user is admin
const adminCheck = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') { 
    next(); 
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Apply both 'protect' (valid token) AND 'adminCheck' (role=admin)
router.post('/broadcast', protect, adminCheck, broadcastAnnouncement);
router.get('/stats', protect, adminCheck, getSystemStats);

export default router;