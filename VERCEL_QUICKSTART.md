# Quick Vercel Deployment

## 🚀 Deploy in 5 Minutes

### 1. Deploy Backend
```bash
cd backend
vercel --prod
```
Copy the URL you get (e.g., `https://your-backend-abc123.vercel.app`)

### 2. Deploy Frontend
```bash
cd frontend
vercel --prod
```

When prompted for environment variables, add:
- `NEXT_PUBLIC_API_URL` = `https://your-backend-abc123.vercel.app/api`

### 3. Done! 🎉

Visit your frontend URL and start using the app.

## Via Vercel Dashboard

### Backend:
1. Go to https://vercel.com/new
2. Import your repo
3. Set Root Directory: `backend`
4. Deploy

### Frontend:
1. Go to https://vercel.com/new
2. Import your repo (same repo, new project)
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.vercel.app/api`
5. Deploy

## Test Your Deployment

- Backend: `https://your-backend.vercel.app/health`
- Frontend: `https://your-frontend.vercel.app`

## Need Help?

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.
