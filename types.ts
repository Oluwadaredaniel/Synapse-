
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  country: string;
  school: string; 
  interests: string[];
  
  // Gamification
  xp: number; // Raw
  weightedXp?: number; // Normalized
  progressionScore?: number;
  level: number;
  streak: number;
  
  // Domain Specifics
  domainStats?: {
    STEM: number;
    Humanities: number;
    Arts: number;
    Business: number;
    Language: number;
    General: number;
  };

  avatarUrl?: string;
  completedLessons: string[];
  role: 'student' | 'admin';
}

export interface Country {
  _id: string;
  name: string;
  code: string; 
  flag: string;
}

export interface School {
  _id: string;
  name: string;
  country: string; 
}

export interface LessonSection {
  title: string;
  content: string;
  visualPrompt?: string; 
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  
  // AI/Pedagogy
  domain?: 'STEM' | 'Humanities' | 'Arts' | 'Business' | 'Language' | 'General';
  difficultyMultiplier?: number;
  interestUsed: string;

  sections: LessonSection[];
  quiz: QuizQuestion[];
  xpReward: number;
  estimatedTime: string;
  createdAt: string;
  isCompleted: boolean;
  coverImage?: string; // Added field
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  country: string; 
  school?: string;
  xp: number;
  weightedXp?: number; // New
  progressionScore?: number; // New
  domainStats?: Record<string, number>;
  avatarUrl?: string;
}

export enum AppRoute {
  LANDING = '/',
  PWA_LANDING = '/onboarding',
  LOGIN = '/login',
  SIGNUP = '/signup',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  DASHBOARD = '/dashboard',
  UPLOAD = '/upload',
  LEARNING = '/learning',
  QUIZ = '/quiz',
  EXAM = '/exam',
  ACHIEVEMENTS = '/achievements',
  LEADERBOARD = '/leaderboard',
  PROFILE = '/profile',
  SETTINGS = '/settings',
  PRIVACY = '/privacy',
  TERMS = '/terms',
  MISSION = '/mission',
  HOW_IT_WORKS = '/how-it-works',
  AURA_ENGINE = '/aura',
  ADMIN_DASHBOARD = '/admin/dashboard',
}
