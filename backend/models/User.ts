import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  
  // Demographics & Identity
  country: { type: String, required: true, index: true },
  school: { type: String, required: true, index: true },
  
  // Personalization Profile
  interests: [{ type: String }],
  learningStyle: { type: String, default: 'visual', enum: ['visual', 'textual', 'interactive'] },
  aiPersonalizationVectors: { type: Map, of: Number, default: {} },

  // Gamification State (Source of Truth)
  xp: { type: Number, default: 0 }, // Raw XP (Vanilla)
  weightedXp: { type: Number, default: 0, index: true }, // Normalized XP (Fairness Metric)
  progressionScore: { type: Number, default: 0, index: true }, // The "True Skill" Score
  
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  
  // Domain Specific Stats (For Domain Leaderboards)
  domainStats: {
    STEM: { type: Number, default: 0 },
    Humanities: { type: Number, default: 0 },
    Arts: { type: Number, default: 0 },
    Business: { type: Number, default: 0 },
    Language: { type: Number, default: 0 },
    General: { type: Number, default: 0 }
  },

  // Rankings (Cached)
  globalRank: { type: Number, default: 0 },
  schoolRank: { type: Number, default: 0 },

  // Progress Tracking
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  lessonsStarted: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  averageMastery: { type: Number, default: 0 }, // Running average of quiz scores
  
  // System
  role: { type: String, enum: ['student', 'admin', 'moderator'], default: 'student' },
  avatarUrl: { type: String, default: 'https://picsum.photos/200' },
  isVerified: { type: Boolean, default: false },

  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { 
  timestamps: true,
  minimize: false 
});

// Indexes for high-performance leaderboard queries
userSchema.index({ weightedXp: -1 });
userSchema.index({ progressionScore: -1 });
userSchema.index({ school: 1, weightedXp: -1 });
userSchema.index({ "domainStats.STEM": -1 });

export default mongoose.model('User', userSchema);