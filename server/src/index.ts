import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import goalRoutes from './routes/goal';
import peerGroupRoutes from './routes/peerGroup';

// Config
import './config/passport';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create index directory if it doesn't exist
const indexPath = path.join(__dirname, '../index');
if (!fs.existsSync(indexPath)) {
  fs.mkdirSync(indexPath, { recursive: true });
  console.log('Created index directory for user spaces');
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
console.log('CORS configured for client URL:', clientUrl);

// Ensure CORS is properly configured for credentials
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      clientUrl, 
      'http://localhost:5173', 
      'http://127.0.0.1:5173'
    ];
    
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['set-cookie']
}));

// Session setup for OAuth
app.use(session({
  secret: process.env.JWT_SECRET as string,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/peer-groups', peerGroupRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Index route directory
app.use('/index', express.static(path.join(__dirname, '../index')));

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler caught:', err);
  
  // Ensure we always return JSON instead of HTML for errors
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Connect to MongoDB
console.log('Attempting to connect to MongoDB at:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, but log the error
    console.error('Server will continue to run, but database operations will fail');
  });

export default app; 