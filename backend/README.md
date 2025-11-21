# Zenith Study Hub - Backend API

A comprehensive REST API for managing student academic life, including calendar events, projects, focus sessions, and course management.

## 🚀 Quick Start

### Development Mode (No Database Required)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The server will automatically find an available port starting from 3333.

### Production Mode (With Database)

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start production server
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3333/api
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📅 Calendar Endpoints

### Get All Events
```http
GET /api/calendar
Authorization: Bearer <token>

# Optional query parameters:
?start=2024-11-01&end=2024-11-30
```

### Create Event
```http
POST /api/calendar
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Math Assignment Due",
  "description": "Complete problem set 5",
  "date": "2024-11-25",
  "time": "23:59",
  "type": "assignment",
  "course_id": 1
}
```

**Event Types:** `assignment`, `exam`, `reading`, `custom`

### Update Event
```http
PUT /api/calendar/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "date": "2024-11-26"
}
```

### Delete Event
```http
DELETE /api/calendar/:id
Authorization: Bearer <token>
```

---

## 📚 Course Endpoints

### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>
```

### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mathematics",
  "code": "MATH101",
  "color": "#3B82F6"
}
```

### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Advanced Mathematics",
  "color": "#EF4444"
}
```

### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

---

## 📋 Project Endpoints

### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development Portfolio",
  "description": "Build a personal portfolio",
  "course_id": 3,
  "due_date": "2024-12-15",
  "status": "active"
}
```

**Status Options:** `active`, `completed`, `archived`

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 75,
  "status": "active"
}
```

### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## 🎯 Focus Session Endpoints

### Get Session History
```http
GET /api/focus/sessions
Authorization: Bearer <token>

# Optional query parameter:
?limit=50
```

### Start Focus Session
```http
POST /api/focus/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_id": 1,
  "duration": 1800
}
```

**Duration:** in seconds (1800 = 30 minutes)

### End Focus Session
```http
POST /api/focus/:id/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Completed chapter 5 review"
}
```

### Get Focus Statistics
```http
GET /api/focus/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_sessions": 15,
  "total_minutes": 450,
  "total_hours": 7,
  "sessions_by_date": {
    "2024-11-20": 3,
    "2024-11-21": 2
  }
}
```

---

## 📄 Syllabus Endpoints

### Parse Syllabus (Mock)
```http
POST /api/syllabus/parse
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_id": 1
}
```

### Bulk Create Events
```http
POST /api/syllabus/create-events
Authorization: Bearer <token>
Content-Type: application/json

{
  "events": [
    {
      "title": "Assignment 1",
      "date": "2024-11-25",
      "type": "assignment",
      "course_id": 1
    },
    {
      "title": "Midterm Exam",
      "date": "2024-12-05",
      "type": "exam",
      "course_id": 1
    }
  ]
}
```

---

## 🏥 Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-20T10:30:00.000Z"
}
```

---

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Knex.js** - SQL query builder (production mode)
- **PostgreSQL** - Database (production mode)

---

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── calendar.js           # Calendar event routes
│   │   ├── courses.js            # Course management routes
│   │   ├── projects.js           # Project management routes
│   │   ├── focus.js              # Focus session routes
│   │   └── syllabus.js           # Syllabus parsing routes
│   ├── server.js                 # Production server (with database)
│   └── server-simple.js          # Development server (mock data)
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🔒 Security Features

- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Authentication:** Secure token-based auth
- **Helmet:** Security headers
- **Input Validation:** express-validator
- **User Data Isolation:** All queries filtered by user_id
- **CORS:** Configurable cross-origin policies

---

## 🚢 Deployment

### Environment Variables

Required for production:
```bash
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=zenith_study_hub
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### Deployment Platforms

#### Heroku
```bash
heroku create zenith-study-hub-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Railway
```bash
railway init
railway add postgresql
railway up
```

#### Render
1. Connect your GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

---

## 📝 License

MIT License - feel free to use this project for learning and development.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Support

For issues and questions, please open an issue on GitHub.
