# 🎓 Zenith Study Hub

A comprehensive student productivity platform for managing academic life, featuring calendar management, project tracking, focus sessions, and course organization.

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 📅 Smart Calendar
- Create and manage academic events (assignments, exams, readings)
- Color-coded by course
- Date range filtering
- Quick event creation

### 📚 Course Management
- Add and organize courses
- Custom color coding
- Course-specific tracking

### 📋 Project Tracker
- Track group projects and assignments
- Progress monitoring
- Due date management
- Status tracking (active, completed, archived)

### 🎯 Focus Mode
- Pomodoro-style focus sessions
- Track study time by course
- Session history and statistics
- Productivity analytics

### 📄 Syllabus Parser (Coming Soon)
- Upload PDF syllabi
- Automatic event extraction
- Bulk calendar import

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zenith-study-hub.git
cd zenith-study-hub

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Server will start on http://localhost:3333 (or next available port)

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
App will open at http://localhost:3000

---

## 📁 Project Structure

```
zenith-study-hub/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── server-simple.js   # Mock server (no database)
│   │   ├── server.js          # Production server (with database)
│   │   ├── routes/            # API route handlers
│   │   ├── middleware/        # Auth & validation
│   │   └── config/            # Database configuration
│   ├── package.json
│   └── README.md
│
├── frontend/                   # Next.js 14 application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API client
│   │   └── hooks/             # Custom React hooks
│   ├── package.json
│   └── tailwind.config.js
│
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **date-fns** - Date manipulation

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Knex.js** - SQL query builder (production)
- **PostgreSQL** - Database (production)

### Development
- **Mock Mode** - No database required for development
- **Hot Reload** - Instant updates during development
- **ESLint** - Code linting
- **Jest** - Testing framework

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Calendar
- `GET /api/calendar` - Get all events
- `POST /api/calendar` - Create event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Focus Sessions
- `GET /api/focus/sessions` - Get session history
- `POST /api/focus/start` - Start session
- `POST /api/focus/:id/end` - End session
- `GET /api/focus/stats` - Get statistics

See [backend/README.md](backend/README.md) for detailed API documentation.

---

## 🚢 Deployment

### Quick Deploy

**Backend to Render:**
1. Push to GitHub
2. Connect repository on [render.com](https://render.com)
3. Deploy as Web Service
4. Copy API URL

**Frontend to Vercel:**
1. Update API URL in `frontend/src/lib/api.ts`
2. Push to GitHub
3. Import project on [vercel.com](https://vercel.com)
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Helmet.js security headers
- CORS configuration
- Input validation
- User data isolation
- SQL injection prevention

---

## 📝 Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🎉 Ready to Deploy!

Your Zenith Study Hub is ready for deployment. Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide to get it live!

**Happy Studying! 📚✨**
