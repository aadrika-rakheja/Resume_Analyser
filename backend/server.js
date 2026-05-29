import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for credentials & custom headers
app.use(cors({
  origin: '*', // For development flexibility; narrow in production if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload parsing limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Establish Database Connection (gracefully handles local JSON fallback)
connectDB();

// API Routing
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/chat', chatRoutes);

// Base Route reporting diagnostic status
app.get('/api/status', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    message: '🚀 AI Resume Analyzer API is operational',
    timestamp: new Date().toISOString(),
    diagnostics: {
      db: dbStatus,
      port: PORT,
      nodeVersion: process.version
    }
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error Context:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🔋 Diagnostics check: http://localhost:${PORT}/api/status`);
  console.log(`==================================================`);
});
