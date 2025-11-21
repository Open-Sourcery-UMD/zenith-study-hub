# 🚀 Zenith Study Hub - Deployment Guide

Complete guide to deploy both frontend and backend of Zenith Study Hub.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Testing Deployment](#testing-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Account on deployment platform (Vercel, Render, Railway, or Heroku)

---

## 🔧 Backend Deployment

The backend runs in **mock mode** (no database required) for easy deployment.

### Option 1: Deploy to Render (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `zenith-study-hub-api`
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your API URL: `https://zenith-study-hub-api.onrender.com`

### Option 2: Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Get URL**
   ```bash
   railway domain
   ```

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or download from heroku.com
   ```

2. **Deploy**
   ```bash
   cd backend
   heroku login
   heroku create zenith-study-hub-api
   git push heroku main
   ```

3. **Get URL**
   ```bash
   heroku open
   ```

### Option 4: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd backend
   vercel
   ```

3. **Follow prompts**
   - Link to existing project or create new
   - Deploy

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended for Next.js)

1. **Update API URL**
   
   Edit `frontend/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.onrender.com/api';
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update API URL"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - **Framework Preset:** Next.js
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`
   
4. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

### Option 2: Deploy to Netlify

1. **Update API URL** (same as above)

2. **Create `netlify.toml`**
   ```bash
   cd frontend
   cat > netlify.toml << EOF
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   EOF
   ```

3. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select repository
   - Configure:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
   - Add environment variable: `NEXT_PUBLIC_API_URL`
   - Deploy

---

## 🔐 Environment Configuration

### Backend Environment Variables

For production deployment, create these environment variables in your hosting platform:

```bash
# Server
PORT=10000
NODE_ENV=production

# CORS (optional - for specific frontend URL)
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app

# JWT (if using real auth)
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables

```bash
# API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api

# App URL (optional)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## ✅ Testing Deployment

### Test Backend

1. **Health Check**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   
   Expected response:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-11-20T10:30:00.000Z"
   }
   ```

2. **Test Login**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Test Calendar**
   ```bash
   curl https://your-backend-url.onrender.com/api/calendar \
     -H "Authorization: Bearer mock-jwt-token-123"
   ```

### Test Frontend

1. **Visit your deployed URL**
   ```
   https://your-app.vercel.app
   ```

2. **Test Login**
   - Go to login page
   - Enter any email/password
   - Should redirect to dashboard

3. **Test Features**
   - ✅ Calendar view
   - ✅ Create events
   - ✅ Projects page
   - ✅ Focus mode
   - ✅ Navigation

---

## 🐛 Troubleshooting

### Backend Issues

#### "Application Error" on Render
- Check logs: Dashboard → Logs
- Verify `npm start` command works locally
- Check Node.js version matches

#### CORS Errors
Add to backend `server-simple.js`:
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}));
```

#### Port Issues
Render uses `PORT` environment variable automatically. Make sure your server listens on:
```javascript
const PORT = process.env.PORT || 3333;
```

### Frontend Issues

#### "Failed to fetch" errors
- Verify API URL is correct
- Check CORS settings on backend
- Verify backend is running

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables Not Working
- Restart deployment after adding variables
- Verify variable names start with `NEXT_PUBLIC_`
- Check for typos

### Common Issues

#### 1. API URL Not Updating
Clear browser cache or use incognito mode

#### 2. Slow Cold Starts (Render Free Tier)
Free tier spins down after inactivity. First request takes 30-60 seconds.

#### 3. Build Timeout
Increase build timeout in platform settings or optimize build:
```json
{
  "scripts": {
    "build": "next build --no-lint"
  }
}
```

---

## 📊 Monitoring

### Backend Monitoring

**Render:**
- Dashboard → Metrics
- View CPU, Memory, Response times

**Uptime Monitoring:**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Monitor: `https://your-backend-url.onrender.com/health`

### Frontend Monitoring

**Vercel:**
- Analytics tab shows page views, performance
- Real-time logs in Deployments tab

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Deploy**
   - Vercel/Render detects push
   - Builds and deploys automatically
   - Takes 2-5 minutes

### Preview Deployments

**Vercel** creates preview URLs for pull requests:
- Create PR on GitHub
- Vercel deploys preview
- Test before merging

---

## 🎯 Production Checklist

### Before Deploying

- [ ] Update API URL in frontend
- [ ] Test all features locally
- [ ] Run `npm run build` successfully
- [ ] Check for console errors
- [ ] Test on mobile viewport
- [ ] Verify environment variables

### After Deploying

- [ ] Test health endpoint
- [ ] Test login/register
- [ ] Test all CRUD operations
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Set up monitoring
- [ ] Share URL with users!

---

## 🚀 Quick Deploy Commands

### Full Deployment (Both Frontend & Backend)

```bash
# 1. Commit changes
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy backend to Render
# (Use Render dashboard - automatic from GitHub)

# 3. Deploy frontend to Vercel
cd frontend
vercel --prod

# 4. Test
curl https://your-backend-url.onrender.com/health
open https://your-frontend-url.vercel.app
```

---

## 📞 Support

If you encounter issues:

1. Check logs on your hosting platform
2. Review this troubleshooting guide
3. Test locally first
4. Check GitHub issues
5. Contact support

---

## 🎉 Success!

Your Zenith Study Hub is now live! Share your URL:

```
🌐 Frontend: https://your-app.vercel.app
🔧 Backend: https://your-backend-url.onrender.com
📚 API Docs: https://your-backend-url.onrender.com/
```

Happy studying! 📚✨
