const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');

const app = express();

// In-memory data store
let users = [];
let calendar_events = [];
let projects = [];
let focus_sessions = [];
let courses = [
  { id: 1, name: 'Mathematics', code: 'MATH101', color: '#3B82F6' },
  { id: 2, name: 'Physics', code: 'PHYS201', color: '#EF4444' },
  { id: 3, name: 'Computer Science', code: 'CS301', color: '#10B981' }
];

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token === 'mock-jwt-token-123') {
    req.userId = 1; // Mock user ID
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Zenith Study Hub API is running!',
    endpoints: [
      '/health', 
      '/api/auth/login', 
      '/api/auth/register', 
      '/api/calendar',
      '/api/projects',
      '/api/focus',
      '/api/courses'
    ]
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

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

  if (email && password && name) {
    res.status(201).json({
      user: { id: 1, email, name },
      token: 'mock-jwt-token-123'
    });
  } else {
    res.status(400).json({ error: 'All fields required' });
  }
});

// Calendar routes
app.get('/api/calendar', authMiddleware, (req, res) => {
  const mockEvents = [
    {
      id: 1,
      title: 'Math Assignment Due',
      description: 'Complete calculus problem set',
      date: '2024-11-15',
      time: '23:59',
      type: 'assignment',
      course_id: 1,
      user_id: 1
    },
    {
      id: 2,
      title: 'Physics Exam',
      description: 'Midterm exam covering chapters 1-5',
      date: '2024-11-20',
      time: '14:00',
      type: 'exam',
      course_id: 2,
      user_id: 1
    },
    {
      id: 3,
      title: 'CS Project Demo',
      description: 'Present final project to class',
      date: '2024-11-25',
      time: '10:00',
      type: 'presentation',
      course_id: 3,
      user_id: 1
    }
  ];
  res.json(mockEvents);
});

app.post('/api/calendar', authMiddleware, (req, res) => {
  const { title, description, date, time, type, course_id } = req.body;
  
  if (!title || !date || !type) {
    return res.status(400).json({ error: 'Title, date, and type are required' });
  }

  const newEvent = {
    id: calendar_events.length + 1,
    title,
    description,
    date,
    time,
    type,
    course_id,
    user_id: req.userId,
    created_at: new Date().toISOString()
  };

  calendar_events.push(newEvent);
  res.status(201).json(newEvent);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Function to find available port
function findAvailablePort(startPort = 3333) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();

    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

// Start server with available port
findAvailablePort().then(port => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 Visit: http://localhost:${port}`);
    console.log(`🔗 API Health: http://localhost:${port}/health`);
    console.log(`📝 Update your frontend to use: http://localhost:${port}/api`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});

// Projects routes
app.get('/api/projects', authMiddleware, (req, res) => {
  const mockProjects = [
    {
      id: 1,
      name: 'Web Development Portfolio',
      description: 'Build a personal portfolio website using React',
      course_id: 3,
      course_name: 'Computer Science',
      due_date: '2024-12-01',
      status: 'active',
      progress: 65,
      user_id: 1
    },
    {
      id: 2,
      name: 'Physics Lab Report',
      description: 'Analyze pendulum motion experiment data',
      course_id: 2,
      course_name: 'Physics',
      due_date: '2024-11-18',
      status: 'active',
      progress: 30,
      user_id: 1
    }
  ];
  res.json(mockProjects);
});

app.post('/api/projects', authMiddleware, (req, res) => {
  const { name, description, course_id, due_date, status } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    description,
    course_id,
    due_date,
    status: status || 'active',
    progress: 0,
    user_id: req.userId,
    created_at: new Date().toISOString()
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Focus routes
app.get('/api/focus/sessions', authMiddleware, (req, res) => {
  const mockSessions = [
    {
      id: 1,
      duration: 1800, // 30 minutes
      course_id: 1,
      course_name: 'Mathematics',
      started_at: '2024-11-01T14:00:00Z',
      ended_at: '2024-11-01T14:30:00Z',
      user_id: 1
    },
    {
      id: 2,
      duration: 2700, // 45 minutes
      course_id: 2,
      course_name: 'Physics',
      started_at: '2024-11-01T16:00:00Z',
      ended_at: '2024-11-01T16:45:00Z',
      user_id: 1
    }
  ];
  res.json(mockSessions);
});

app.post('/api/focus/start', authMiddleware, (req, res) => {
  const { course_id, duration } = req.body;
  
  const newSession = {
    id: focus_sessions.length + 1,
    course_id,
    duration: duration || 1800, // Default 30 minutes
    started_at: new Date().toISOString(),
    user_id: req.userId,
    status: 'active'
  };

  focus_sessions.push(newSession);
  res.status(201).json(newSession);
});

app.post('/api/focus/:id/end', authMiddleware, (req, res) => {
  const sessionId = parseInt(req.params.id);
  const session = focus_sessions.find(s => s.id === sessionId && s.user_id === req.userId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  session.ended_at = new Date().toISOString();
  session.status = 'completed';
  
  res.json(session);
});

// Courses routes
app.get('/api/courses', authMiddleware, (req, res) => {
  res.json(courses);
});

app.post('/api/courses', authMiddleware, (req, res) => {
  const { name, code, color } = req.body;
  
  if (!name || !code) {
    return res.status(400).json({ error: 'Course name and code are required' });
  }

  const newCourse = {
    id: courses.length + 1,
    name,
    code,
    color: color || '#6B7280',
    user_id: req.userId
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// Syllabus routes
app.post('/api/syllabus/parse', authMiddleware, (req, res) => {
  // Mock syllabus parsing
  const mockParsedData = {
    course_name: 'Introduction to Computer Science',
    assignments: [
      { title: 'Assignment 1: Variables and Data Types', due_date: '2024-11-15' },
      { title: 'Assignment 2: Control Structures', due_date: '2024-11-22' },
      { title: 'Final Project', due_date: '2024-12-10' }
    ],
    exams: [
      { title: 'Midterm Exam', date: '2024-11-20' },
      { title: 'Final Exam', date: '2024-12-15' }
    ]
  };
  
  res.json(mockParsedData);
});

app.post('/api/syllabus/create-events', authMiddleware, (req, res) => {
  const { course_id, assignments, exams } = req.body;
  
  const createdEvents = [];
  
  // Create assignment events
  if (assignments) {
    assignments.forEach((assignment, index) => {
      const event = {
        id: calendar_events.length + createdEvents.length + 1,
        title: assignment.title,
        date: assignment.due_date,
        type: 'assignment',
        course_id,
        user_id: req.userId
      };
      createdEvents.push(event);
    });
  }
  
  // Create exam events
  if (exams) {
    exams.forEach((exam, index) => {
      const event = {
        id: calendar_events.length + createdEvents.length + 1,
        title: exam.title,
        date: exam.date,
        type: 'exam',
        course_id,
        user_id: req.userId
      };
      createdEvents.push(event);
    });
  }
  
  calendar_events.push(...createdEvents);
  res.status(201).json({ message: 'Events created successfully', events: createdEvents });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Function to find available port
function findAvailablePort(startPort = 3333) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();

    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

// Start server with available port
findAvailablePort().then(port => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 Visit: http://localhost:${port}`);
    console.log(`🔗 API Health: http://localhost:${port}/health`);
    console.log(`📝 Update your frontend to use: http://localhost:${port}/api`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});

module.exports = app;