import User from '../models/User';

/**
 * RANKING SYSTEM (Multi-Dimensional)
 * 
 * Sorts by 'weightedXp' by default to ensure fairness across domains.
 */

export const getGlobalLeaderboard = async (limit: number = 50, domain?: string) => {
  const query: any = {};
  let sortField = 'weightedXp';

  // If a specific domain is requested, sort by that domain's stats
  if (domain && domain !== 'all') {
    sortField = `domainStats.${domain}`;
    // Only fetch users who have > 0 XP in this domain
    query[`domainStats.${domain}`] = { $gt: 0 };
  }

  return await User.find(query)
    .sort({ [sortField]: -1 })
    .limit(limit)
    .select('username name country school xp weightedXp level avatarUrl domainStats progressionScore')
    .lean();
};

export const getSchoolLeaderboard = async (schoolName: string, limit: number = 50, domain?: string) => {
  const query: any = { school: schoolName };
  let sortField = 'weightedXp';

  if (domain && domain !== 'all') {
    sortField = `domainStats.${domain}`;
    query[`domainStats.${domain}`] = { $gt: 0 };
  }

  return await User.find(query)
    .sort({ [sortField]: -1 })
    .limit(limit)
    .select('username name country school xp weightedXp level avatarUrl domainStats progressionScore')
    .lean();
};

export const getUserRank = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Ranks based on Weighted XP
  const globalRank = await User.countDocuments({ weightedXp: { $gt: user.weightedXp } }) + 1;
  const schoolRank = await User.countDocuments({ school: user.school, weightedXp: { $gt: user.weightedXp } }) + 1;

  return { globalRank, schoolRank };
};