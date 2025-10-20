const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple routes without database
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock successful login
  if (email && password) {
    res.json({
      user: { id: 1, email, name: 'Demo User' },
      token: 'mock-jwt-token-123'
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Mock successful registration
  if (email && password && name) {
    res.status(201).json({
      user: { id: 1, email, name },
      token: 'mock-jwt-token-123'
    });
  } else {
    res.status(400).json({ error: 'All fields required' });
  }
});

// Mock calendar routes
app.get('/api/calendar', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Math Assignment Due',
      date: '2024-10-20',
      type: 'assignment'
    },
    {
      id: 2,
      title: 'Physics Exam',
      date: '2024-10-25',
      type: 'exam'
    }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});

module.exports = app;