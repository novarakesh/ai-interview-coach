import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import speechRoutes from './routes/speechRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (supports root .env and server/.env)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const isServerless = Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Connect to MongoDB Atlas
connectDB().catch((err) => console.error(`[MongoDB] ${err.message}`));

// Behind Netlify/Vercel proxies, trust X-Forwarded-For so rate limiting sees real client IPs
app.set('trust proxy', 1);

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow audio streaming cross-origin
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode for seamless paired testing
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general API rate limiter to /api
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/speech', speechRoutes);


// Serve static frontend build from ../client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Voice Interview Coach Backend',
    models: {
      gemini: process.env.AI_MODEL || 'gemini-2.5-flash',
      murfTts: 'FALCON',
    },
  });
});

// SPA catch-all route for frontend client navigation
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global Centralized Error Handler
app.use(errorHandler);

// Start server if not running in serverless environment
if (process.env.NODE_ENV !== 'test' && !isServerless) {
  app.listen(PORT, () => {
    console.log(`[Server] AI Interview Coach API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Server] Client Origin allowed: ${allowedOrigins.join(', ')}`);
  });
}

export default app;

