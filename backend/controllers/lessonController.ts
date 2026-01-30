import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import User from '../models/User';
import { AuraEngine } from '../services/aiService';
import { awardXp } from '../services/gamificationService';

// @desc    Generate a new lesson from material
// @route   POST /api/lessons
// @access  Private
export const createLesson = async (req: any, res: any) => {
  const { title, topic, content, mediaUrls } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const selectedInterest = user.interests.length > 0 
      ? user.interests[Math.floor(Math.random() * user.interests.length)]
      : 'Pop Culture';

    // 1. Invoke AURA Engine (Text)
    const auraResponse = await AuraEngine.generateLesson({
      topic: topic || title,
      rawContent: content,
      userInterest: selectedInterest,
      difficulty: 'intermediate'
    });

    // 2. Invoke AURA Engine (Image) - Parallel if possible, but sequential for safety here
    let coverImage = null;
    try {
        const imagePrompt = `A conceptual illustration representing ${auraResponse.title}: ${auraResponse.sections?.[0]?.title || topic}`;
        const imageStyle = `${selectedInterest} art style, high quality, vibrant colors`;
        coverImage = await AuraEngine.generateImage(imagePrompt, imageStyle);
    } catch (imgErr) {
        console.warn("Image generation failed, proceeding without cover.");
    }

    // 3. Persist to DB
    const lesson = new Lesson({
      userId: req.user.id,
      title: auraResponse.title,
      topic: topic || title,
      interestUsed: selectedInterest,
      content: content,
      mediaUrls: mediaUrls || [],
      coverImage: coverImage, 
      
      // AI Metadata from AURA
      domain: auraResponse.domain || 'General',
      difficultyMultiplier: auraResponse.difficultyMultiplier || 1.0,
      
      sections: auraResponse.sections,
      quiz: auraResponse.quiz,
      
      xpReward: auraResponse.xpReward,
      estimatedTime: auraResponse.estimatedTime,
      isCompleted: false
    });

    const savedLesson = await lesson.save();
    
    user.lessonsStarted = (user.lessonsStarted || 0) + 1;
    await user.save();

    res.status(201).json(savedLesson);

  } catch (error: any) {
    console.error("Lesson Creation Failed:", error);
    res.status(500).json({ message: 'Failed to generate lesson', error: error.message });
  }
};

// @desc    Get user's lessons
// @route   GET /api/lessons
// @access  Private
export const getMyLessons = async (req: any, res: any) => {
  try {
    const lessons = await Lesson.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private
export const deleteLesson = async (req: any, res: any) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Ensure user owns the lesson
    if (lesson.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Complete a lesson and award XP
// @route   PUT /api/lessons/:id/complete
// @access  Private
export const completeLesson = async (req: any, res: any) => {
  const { xpEarned, masteryScore } = req.body;
  
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    
    if (lesson.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    if (!lesson.isCompleted) {
      lesson.isCompleted = true;
      lesson.completedAt = new Date();
      lesson.masteryScore = masteryScore || 100;
      await lesson.save();

      // IMPORTANT: Pass lesson.id to awardXp so it can lookup domain/multiplier and update weighted XP
      const safeXp = Math.min(xpEarned || lesson.xpReward, lesson.xpReward);
      const newStats = await awardXp(req.user.id, safeXp, lesson.id);
      
      res.json({ 
        message: 'Lesson completed', 
        ...newStats
      });
    } else {
      res.status(400).json({ message: 'Lesson already completed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};