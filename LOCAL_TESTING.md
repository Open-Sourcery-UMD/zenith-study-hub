# Local Testing Guide

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Start Backend

```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 3333
📱 Visit: http://localhost:3333
🔗 API Health: http://localhost:3333/health
```

### 3. Start Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### 4. Test the Application

Open http://localhost:3000 in your browser and test:
- Login (use any email/password)
- Create calendar events
- Create projects
- Start focus sessions

## Testing API Endpoints

### Health Check
```bash
curl http://localhost:3333/health
```

### Login
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Calendar Event
```bash
curl -X POST http://localhost:3333/api/calendar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-jwt-token-123" \
  -d '{
    "title": "Test Event",
    "date": "2024-12-01",
    "type": "assignment"
  }'
```

## Troubleshooting

### Port Already in Use
If port 3333 is taken:
```bash
# Find and kill the process
lsof -ti:3333 | xargs kill -9

# Or use a different port
PORT=3334 npm start
```

Then update frontend to use the new port:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3334/api npm run dev
```

### Module Not Found
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Frontend Can't Connect to Backend
Make sure:
1. Backend is running on port 3333
2. Frontend is using the correct API URL
3. Check browser console for errors

## What to Test

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with any credentials
- [ ] Can create calendar events
- [ ] Can create projects
- [ ] Can start focus sessions
- [ ] Data persists during session (but resets on restart)

## Ready for Vercel?

Once everything works locally, you're ready to deploy!
See `VERCEL_QUICKSTART.md` for deployment instructions.
