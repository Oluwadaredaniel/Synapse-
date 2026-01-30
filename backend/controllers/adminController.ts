import { Request, Response } from 'express';
import User from '../models/User';
import Lesson from '../models/Lesson';
import { sendAnnouncementEmail } from '../services/emailService';

// @desc    Get System Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req: any, res: any) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    
    // Calculate growth (mock logic for "last month" comparison for now, or use timestamps)
    const usersLastMonth = await User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } });
    const lessonsLastMonth = await Lesson.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } });

    res.json({
      users: {
        total: totalUsers,
        growth: `+${usersLastMonth}`
      },
      lessons: {
        total: totalLessons,
        growth: `+${lessonsLastMonth}`
      },
      systemStatus: 'Healthy'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// @desc    Broadcast email to users
// @route   POST /api/admin/broadcast
// @access  Private/Admin
export const broadcastAnnouncement = async (req: any, res: any) => {
  try {
    const { subject, message, filterType, filterValue } = req.body;
    
    // 1. Build Query based on filters
    let query: any = {};
    
    if (filterType === 'country' && filterValue) {
      query.country = filterValue;
    } else if (filterType === 'school' && filterValue) {
      query.school = filterValue;
    }
    // If filterType is 'all', query remains empty {} (fetches all users)

    // 2. Fetch Users
    const users = await User.find(query).select('email name');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found matching criteria' });
    }

    // 3. Send Emails (Batching recommended for production)
    // For demo, we iterate. In prod, use a queue like BullMQ or Redis.
    let sentCount = 0;
    
    const emailPromises = users.map(user => {
      sentCount++;
      return sendAnnouncementEmail({ email: user.email, name: user.name }, subject, message)
        .catch(err => console.error(`Failed to email ${user.email}`, err));
    });

    await Promise.all(emailPromises);

    res.json({ 
      message: `Announcement sent successfully to ${sentCount} users.`,
      target: filterType === 'all' ? 'All Users' : `${filterType}: ${filterValue}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during broadcast' });
  }
};