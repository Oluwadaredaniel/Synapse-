import { Request, Response } from 'express';
import User from '../models/User';
import { getGlobalLeaderboard, getSchoolLeaderboard, getUserRank } from '../services/rankingService';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      const ranks = await getUserRank(user.id);
      const userObj = user.toObject();
      res.json({ 
        ...userObj, 
        globalRank: ranks?.globalRank || 0,
        schoolRank: ranks?.schoolRank || 0
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: any, res: any) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.interests = req.body.interests || user.interests;
    user.learningStyle = req.body.learningStyle || user.learningStyle;
    user.school = req.body.school || user.school; // Allow school transfer
    
    const updatedUser = await user.save();
    
    // Return sanitized user object similar to login/profile get
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        interests: updatedUser.interests,
        school: updatedUser.school,
        xp: updatedUser.xp,
        level: updatedUser.level,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get leaderboards
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req: any, res: any) => {
  try {
    const { type, school, domain } = req.query; // Added domain query param

    let leaderboard;
    if (type === 'school' && school) {
      leaderboard = await getSchoolLeaderboard(school as string, 50, domain as string);
    } else {
      leaderboard = await getGlobalLeaderboard(50, domain as string);
    }
    
    // Add rank number to output
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};