import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';

import User from './models/User';
import authRoutes from './routes/auth';
import userRoutes from './routes/userRoutes';
import lessonRoutes from './routes/lessonRoutes';
import locationRoutes from './routes/locationRoutes';
import adminRoutes from './routes/adminRoutes';
import mediaRoutes from './routes/mediaRoutes';

// Load env vars
dotenv.config();

// App Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Essential for deployment behind proxies (Vercel, Heroku, Nginx, AWS ELB)
app.set('trust proxy', 1);

// --- SECURITY & PERFORMANCE MIDDLEWARE ---

// 1. HTTP Security Headers
app.use(helmet()); 

// 2. Gzip Compression
app.use(compression()); 

// 3. Request Logging (Use 'combined' for prod, 'dev' for local)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 4. Rate Limiting (Prevent Brute Force & AI Token Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply rate limiter to all API routes
app.use('/api', limiter);

// 5. CORS Configuration (Strict)
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Strictly define this in .env
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 6. Body Parsing (With size limits to prevent DoS)
app.use(express.json({ limit: '10mb' }));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', system: 'UniLearn Backend v2.1 (Production)' });
});

// Database & Server Startup
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is missing in environment variables");

    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected`);
    
    // --- ADMIN ACCOUNT SEEDING ---
    // Strictly enforces the requested admin credentials on startup
    const adminEmail = 'oluwadare458@gmail.com';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Daniel_2009', salt);

    const adminData = {
        name: 'System Admin',
        username: 'sysadmin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        country: 'Global',
        school: 'Synapse HQ',
        interests: ['Administration', 'AI', 'Technology'],
        isVerified: true
    };

    // Upsert: Create if not exists, Update if exists (ensures password is always synced)
    await User.findOneAndUpdate(
        { email: adminEmail },
        { $set: adminData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`👑 Admin Account Ready: ${adminEmail}`);
    // -----------------------------

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🔒 CORS allowed origin: ${process.env.CLIENT_URL || '*'}`);
      
      // Email Service Status Check
      if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your_email')) {
        console.log(`📧 Email Service: ACTIVE (${process.env.EMAIL_USER})`);
      } else {
        console.log(`⚠️ Email Service: MOCK MODE (Configure backend/.env to send real emails)`);
      }
    });
  } catch (error: any) {
    console.error(`❌ Server Startup Error: ${error.message}`);
    (process as any).exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;