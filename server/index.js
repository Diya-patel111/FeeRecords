const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth.routes');
const standardsRoutes = require('./routes/standards.routes');
const studentsRoutes = require('./routes/students.routes');
const paymentsRoutes = require('./routes/payments.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Routes
// /api/auth does not require authentication to login
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/standards', requireAuth, standardsRoutes);
app.use('/api/students', requireAuth, studentsRoutes);
app.use('/api/payments', requireAuth, paymentsRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error', code: 'SERVER_ERROR' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint Not Found', code: 'NOT_FOUND' });
});

const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 FeeTrack Backend Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && !isProduction) {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️ Port ${port} is already in use. Trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
}

startServer(Number(PORT));

// Export the Express app as a serverless function for Vercel
module.exports = app;
