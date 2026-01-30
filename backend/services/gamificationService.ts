import User from '../models/User';
import Lesson from '../models/Lesson';

/**
 * GAMIFICATION SYSTEM (Fairness Engine)
 * 
 * Implements Multi-Dimensional Ranking Logic.
 */

// MUST MATCH FRONTEND 'constants.ts' EXACTLY
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 5000];

export const calculateLevel = (xp: number): number => {
  // Find the highest threshold the XP has crossed
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1; // Levels are 1-based (Index 0 = Level 1)
    }
  }
  return 1;
};

export const processActivityForStreak = async (user: any) => {
  const now = new Date();
  
  // LOGIC FIX: Use ISO Date Strings (YYYY-MM-DD) to compare dates.
  // This avoids issues with server timezones causing "missed" days if the server is in UTC
  // and the user is in a different zone, provided we assume the "Day" resets at UTC 00:00.
  // Ideally, we'd pass the user's timezone, but UTC consistency is the standard fallback.
  
  const lastActiveDate = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;
  const todayDate = now.toISOString().split('T')[0];

  // Calculate Yesterday's date string
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];

  if (lastActiveDate === todayDate) {
    // Already active today, do nothing to streak
  } else if (lastActiveDate === yesterdayDate) {
    // Active yesterday, extend streak
    user.streak += 1;
  } else {
    // Missed a day (or new user), reset streak
    // If it's a new user (streak 0), set to 1.
    // If they broke a streak, reset to 1.
    user.streak = 1;
  }
  
  user.lastActive = now;
  return user;
};

export const awardXp = async (userId: string, baseRawXp: number, lessonId?: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let weightedAmount = baseRawXp;
  let domain = 'General';

  // 1. Calculate Weighted XP based on Lesson Metadata (AURA Logic)
  if (lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (lesson) {
      domain = lesson.domain || 'General';
      const multiplier = lesson.difficultyMultiplier || 1.0;
      
      // Formula: WeightedXP = RawXP * DifficultyMultiplier
      weightedAmount = Math.round(baseRawXp * multiplier);
      
      // Update Domain Stats map
      if (!user.domainStats) {
         user.domainStats = { STEM: 0, Humanities: 0, Arts: 0, Business: 0, Language: 0, General: 0 };
      }
      
      // Safely update specific domain
      // @ts-ignore - mongoose map/object handling
      const currentStat = user.domainStats[domain] || 0;
      // @ts-ignore
      user.domainStats[domain] = currentStat + weightedAmount;
    }
  }

  // 2. Update Core Stats
  user.xp += baseRawXp; // Raw XP
  user.weightedXp += weightedAmount; // Fair XP
  
  // 3. Recalculate Level using synchronized thresholds
  // We use WeightedXP for leveling to reward difficult subjects more
  const newLevel = calculateLevel(user.weightedXp);
  if (newLevel > user.level) {
    user.level = newLevel;
  }

  // 4. Update Streak
  await processActivityForStreak(user);

  // 5. Update Progression Score (The "True Skill" Metric)
  // Formula: (WeightedXP * 0.5) + (Streak * 10) + (AvgMastery * 5)
  const mastery = user.averageMastery || 0;
  user.progressionScore = Math.round(
    (user.weightedXp * 0.5) + 
    (user.streak * 10) + 
    (mastery * 5)
  );

  // Mongoose map requires this for nested updates sometimes
  user.markModified('domainStats'); 
  
  await user.save();
  return { 
    xp: user.xp, 
    weightedXp: user.weightedXp,
    level: user.level, 
    streak: user.streak,
    progressionScore: user.progressionScore
  };
};