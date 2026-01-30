import { User, Achievement, LeaderboardEntry } from './types';

// --- CONFIGURATION ---

export const getApiUrl = () => {
  // @ts-ignore
  const envUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
  if (envUrl) return envUrl;
  
  // Fallback for local development
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

// --- GAMIFICATION CONSTANTS ---

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 5000];

export const INTERESTS_LIST = [
  "Anime", "Marvel/DC", "K-Pop", "Basketball", "Soccer", 
  "History", "Sci-Fi", "Gaming", "Music Production", "Cooking"
];

// --- MOCK DATA (Fallback) ---

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  username: 'arivera',
  email: 'alex@example.com',
  country: 'Nigeria',
  school: 'University of Lagos (UNILAG)',
  interests: ['Anime', 'Cyberpunk', 'Basketball', 'Sci-Fi'],
  xp: 450,
  level: 3,
  streak: 5,
  avatarUrl: 'https://picsum.photos/200/200',
  completedLessons: [],
  role: 'student',
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: '🚀', unlockedAt: '2023-01-01' },
  { id: '2', title: 'Streak Master', description: 'Reach a 7-day streak', icon: '🔥', unlockedAt: '2023-01-08' },
  { id: '3', title: 'Quiz Whiz', description: 'Score 100% on a quiz', icon: '🧠', unlockedAt: '2023-01-05' },
  { id: '4', title: 'Night Owl', description: 'Complete a lesson after midnight', icon: '🦉' }, // Locked
  { id: '5', title: 'Socialite', description: 'Share a lesson with a friend', icon: '🤝' }, // Locked
  { id: '6', title: 'Content Creator', description: 'Upload 5 materials', icon: '✍️' }, // Locked
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u2', username: 'Sarah J.', country: 'United States', school: 'Harvard University', xp: 2400, avatarUrl: 'https://picsum.photos/201' },
  { rank: 2, userId: 'u3', username: 'Mike Chen', country: 'Nigeria', school: 'Covenant University', xp: 2150, avatarUrl: 'https://picsum.photos/202' },
  { rank: 3, userId: 'u1', username: 'Alex Rivera', country: 'Nigeria', school: 'University of Lagos (UNILAG)', xp: 450, avatarUrl: 'https://picsum.photos/200' },
  { rank: 4, userId: 'u4', username: 'Jessica D.', country: 'India', school: 'IIT Bombay', xp: 320, avatarUrl: 'https://picsum.photos/203' },
  { rank: 5, userId: 'u5', username: 'Tom Holland', country: 'United Kingdom', school: 'Oxford University', xp: 150, avatarUrl: 'https://picsum.photos/204' },
];