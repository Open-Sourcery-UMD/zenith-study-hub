# Production Setup Guide

## Current State vs Production Ready

### ⚠️ Current Implementation (Development/Demo)
- In-memory data storage (data lost on restart)
- Mock authentication (any credentials work)
- No data persistence
- No real security measures

### ✅ What's Ready for Vercel
- Express.js API properly configured
- Next.js frontend optimized
- CORS configured
- Rate limiting enabled
- Helmet security headers
- Proper error handling
- Serverless-compatible code

## Making It Production-Ready

### 1. Database Setup (Required for Real Use)

#### Option A: Vercel Postgres
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# In Vercel dashboard:
# Storage → Create Database → Postgres
# Copy connection string to environment variables
```

#### Option B: External Database (Recommended)
- **Supabase** (Free tier available): https://supabase.com
- **Neon** (Serverless Postgres): https://neon.tech
- **PlanetScale** (MySQL): https://planetscale.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas

### 2. Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=3333
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

### 3. Implement Real Authentication

Replace mock auth in `backend/src/server-simple.js`:

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Real login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Query user from database
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

// Real auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4. Database Migrations

Use the existing migrations in `database/migrations/`:

```bash
# Install migration tool
npm install knex pg

# Run migrations
npx knex migrate:latest
```

Or use your database provider's migration tools.

### 5. Security Enhancements

#### Update CORS for Production
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Add Input Validation
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/calendar',
  authMiddleware,
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('date').isISO8601(),
    body('type').isIn(['assignment', 'exam', 'class', 'event'])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of handler
  }
);
```

### 6. Monitoring & Logging

#### Add Logging Service
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add cloud logging service
  ]
});
```

#### Error Tracking
- **Sentry**: https://sentry.io
- **LogRocket**: https://logrocket.com
- **Datadog**: https://www.datadoghq.com

### 7. Performance Optimization

#### Backend
- Add Redis for caching
- Implement connection pooling
- Add database indexes
- Enable compression

#### Frontend
- Enable Next.js Image Optimization
- Implement lazy loading
- Add service worker for offline support
- Use React.memo for expensive components

### 8. Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 9. CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: cd backend && vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Frontend
        run: cd frontend && vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Deployment Steps

### Quick Deploy (Current State)
1. Deploy backend: `cd backend && vercel --prod`
2. Deploy frontend: `cd frontend && vercel --prod`
3. Set environment variables in Vercel dashboard

### Production Deploy (With Database)
1. Set up database (Supabase, Neon, etc.)
2. Run migrations
3. Update environment variables
4. Deploy backend with database connection
5. Deploy frontend
6. Test thoroughly

## Cost Estimates

### Free Tier (Good for Testing)
- Vercel: Free (Hobby plan)
- Supabase: Free (500MB database)
- Total: $0/month

### Production (Small Scale)
- Vercel Pro: $20/month
- Database (Supabase Pro): $25/month
- Monitoring (Sentry): $26/month
- Total: ~$71/month

### Production (Medium Scale)
- Vercel Team: $20/user/month
- Database: $50-100/month
- Monitoring & Logging: $50/month
- CDN: $20/month
- Total: ~$140-190/month

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Express.js Docs: https://expressjs.com
- PostgreSQL Docs: https://www.postgresql.org/docs

## Quick Start (Current Demo Version)

The current version works perfectly for:
- ✅ Demos and presentations
- ✅ Testing and development
- ✅ Proof of concept
- ✅ Learning and experimentation

Just deploy as-is following `VERCEL_QUICKSTART.md`!

## Upgrade Path

1. **Phase 1**: Deploy current version (5 minutes)
2. **Phase 2**: Add database (1-2 hours)
3. **Phase 3**: Implement real auth (2-3 hours)
4. **Phase 4**: Add monitoring (1 hour)
5. **Phase 5**: Security hardening (2-3 hours)
6. **Phase 6**: Performance optimization (ongoing)

---

**Current Status**: ✅ Ready for Vercel deployment as a demo/development application
**Production Ready**: ⚠️ Requires database and authentication implementation
