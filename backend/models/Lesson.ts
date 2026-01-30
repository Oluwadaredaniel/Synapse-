import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Core Metadata
  title: { type: String, required: true },
  topic: { type: String, required: true },
  interestUsed: { type: String, required: true },
  coverImage: { type: String }, // Base64 Data URI
  
  // Pedagogical Metadata
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  domain: { 
    type: String, 
    enum: ['STEM', 'Humanities', 'Arts', 'Business', 'Language', 'General'], 
    default: 'General',
    index: true 
  },
  difficultyMultiplier: { type: Number, default: 1.0 }, // 1.0 - 1.5 based on complexity
  
  // Source Material
  content: { type: String },
  sourceType: { type: String, enum: ['text', 'pdf', 'slide'], default: 'text' },
  mediaUrls: [{ type: String }], 

  // AI Generated Content
  sections: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    visualPrompt: String,
    keyTakeaways: [String]
  }],
  
  // Assessment
  quiz: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    explanation: { type: String, required: true },
    difficulty: { type: Number, default: 1 }
  }],

  // Rewards & Stats
  xpReward: { type: Number, default: 100 },
  estimatedTime: { type: String, default: '15 min' },
  
  // State
  isCompleted: { type: Boolean, default: false },
  masteryScore: { type: Number, default: 0 },
  completedAt: { type: Date }

}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);