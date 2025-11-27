# Vercel Deployment Guide for Zenith Study Hub

This guide will help you deploy both the frontend and backend to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git repository with your code pushed to GitHub, GitLab, or Bitbucket
- Vercel CLI installed (optional): `npm i -g vercel`

## Backend Deployment

### Step 1: Deploy Backend First

1. Go to https://vercel.com/new
2. Import your repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (not needed for Node.js API)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables (if needed):
   - `NODE_ENV`: `production`
   - Add any other environment variables your app needs

5. Click "Deploy"

6. Once deployed, copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. Go to https://vercel.com/new again
2. Import your repository (same repo, different project)
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.vercel.app/api` (use your actual backend URL from Step 1)

5. Click "Deploy"

## Alternative: Deploy via CLI

### Backend
```bash
cd backend
vercel --prod
```

### Frontend
```bash
cd frontend
vercel --prod
```

## Post-Deployment Configuration

### Update Frontend to Use Backend URL

After deploying the backend, update your frontend environment variable:

1. Go to your frontend project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your backend URL
4. Redeploy the frontend

### Update CORS Settings (if needed)

If you encounter CORS issues, the backend is already configured with permissive CORS settings. For production, you may want to restrict this to your frontend domain only.

Edit `backend/src/server-simple.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

## Verification

After deployment, test your application:

1. **Backend Health Check**: Visit `https://your-backend.vercel.app/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend**: Visit your frontend URL
   - Should load the application
   - Try logging in with any credentials (mock auth)
   - Test creating calendar events, projects, etc.

## Troubleshooting

### Backend Issues

**Problem**: 500 Internal Server Error
- Check Vercel logs: Go to your backend project → Deployments → Click on deployment → View Function Logs
- Ensure all dependencies are in `package.json`

**Problem**: Module not found errors
- Make sure all imports use relative paths correctly
- Verify `package.json` includes all required dependencies

### Frontend Issues

**Problem**: API calls failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend URL is accessible

**Problem**: Build fails
- Check build logs in Vercel dashboard
- Ensure all TypeScript types are correct
- Run `npm run build` locally to catch errors

### Common Issues

**Problem**: Environment variables not working
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- After changing environment variables, redeploy the project
- Clear browser cache and hard refresh

**Problem**: 404 on API routes
- Verify the backend URL is correct
- Check that routes in `server-simple.js` match your API calls
- Ensure vercel.json routing is correct

## Monitoring

- View logs: Vercel Dashboard → Your Project → Deployments → Function Logs
- Set up monitoring: Vercel Dashboard → Your Project → Settings → Monitoring
- Enable Analytics: Vercel Dashboard → Your Project → Analytics

## Custom Domains (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update environment variables if needed

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: When you create a pull request

To disable automatic deployments:
1. Go to Settings → Git
2. Configure deployment branches

## Local Development

To run locally with production-like settings:

```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Set up `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Security Recommendations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Restrict CORS to your frontend domain in production
3. **Rate Limiting**: The backend includes rate limiting middleware
4. **Authentication**: Implement proper JWT authentication (currently using mock auth)
5. **Database**: Connect to a real database (currently using in-memory storage)

## Next Steps

1. Set up a production database (PostgreSQL recommended)
2. Implement real authentication with secure password hashing
3. Add proper error tracking (e.g., Sentry)
4. Set up CI/CD pipelines
5. Add automated tests

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Documentation: https://nextjs.org/docs

---

**Note**: The current implementation uses in-memory storage and mock authentication. For production use, you should:
- Connect to a real database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and authorization
- Add data validation and sanitization
- Implement proper error handling and logging
