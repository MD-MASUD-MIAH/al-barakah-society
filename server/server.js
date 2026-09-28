require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const depositRoutes = require('./routes/depositRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Initialize app & server
const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        !process.env.CLIENT_URL ||
        process.env.CLIENT_URL === '*' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin === process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

// Attach socket.io instance to express app
app.set('io', io);

// Socket event handler
socketHandler(io);

// Connect to Database
connectDB();

// Global Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any vercel domain, localhost, or configured CLIENT_URL
      if (
        !process.env.CLIENT_URL ||
        process.env.CLIENT_URL === '*' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin === process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serverless DB ready middleware: ensures DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in request middleware:', err);
  }
  next();
});

// API Routes (mounted with /api prefix and fallback root prefix for Vercel rewrite compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/deposits', depositRoutes);
app.use('/deposits', depositRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/messages', messageRoutes);
app.use('/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    society: 'Al-Barakah Society (আল-বারাকাহ সোসাইটি)',
    slogan: 'বিশ্বাসের বন্ধন',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('🌿 Al-Barakah Society API Server is running.');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Endpoint not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Al-Barakah Society Server running on port ${PORT}`);
    console.log(`🌿 Branding: আল-বারাকাহ সোসাইটি (বিশ্বাসের বন্ধন)`);
    console.log(`📡 Realtime Socket.io initialized`);
    console.log(`=========================================`);
  });
}

module.exports = app;
module.exports.server = server;

