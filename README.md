# Zenith Study Hub

An all-in-one web application that acts as the central command center for a student's academic life.

## Features

### 🗓️ Smart Calendar
- Upload syllabi and automatically populate calendar with due dates, exams, and reading assignments
- Intelligent syllabus parsing using PDF text extraction
- Course-based organization and color coding

### 👥 Collaborative Project Management
- Create and manage group projects like a simplified Trello/Asana
- Task assignment and tracking
- File sharing and team communication
- Project status tracking and deadlines

### 🎯 Focus Mode
- Integrated calendar-based focus sessions
- Website blocking for distraction-free studying
- Study time tracking for specific courses or assignments
- Productivity analytics and insights

### 📚 Course Management
- Organize all courses, assignments, and study materials
- Centralized dashboard for academic overview
- Progress tracking and completion status

## Tech Stack

- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **File Upload**: Multer
- **PDF Processing**: pdf-parse
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zenith-study-hub
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

4. Set up the database:
```bash
# Create PostgreSQL database
createdb zenith_study_hub

# Run migrations
cd backend
npm run migrate
```

5. Start the development servers:
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Using Docker

1. Start all services:
```bash
docker-compose up -d
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

## Project Structure

```
zenith-study-hub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── migrations/
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Calendar
- `GET /api/calendar` - Get calendar events
- `POST /api/calendar` - Create calendar event
- `PUT /api/calendar/:id` - Update calendar event
- `DELETE /api/calendar/:id` - Delete calendar event

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project

### Focus Sessions
- `POST /api/focus/start` - Start focus session
- `POST /api/focus/:id/end` - End focus session
- `GET /api/focus/sessions` - Get focus sessions

### Syllabus
- `POST /api/syllabus/parse` - Parse syllabus PDF
- `POST /api/syllabus/create-events` - Create events from syllabus

## Team

- **Shreyas Thirumale** (Project Lead)
- **Jimmy Zhang** (Contributor)
- **Sameer Chawla** (Contributor)
- **Yidong Guo** (Contributor)
- **Angela Wu** (Contributor)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.