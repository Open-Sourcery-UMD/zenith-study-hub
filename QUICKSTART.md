# ⚡ Quick Start Guide

Get Zenith Study Hub running in 5 minutes!

---

## 🚀 Local Development

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start Backend

```bash
cd backend
npm run dev
```

✅ Backend running at: http://localhost:3333

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend running at: http://localhost:3000

### 4. Test It!

1. Open http://localhost:3000
2. Click "Login"
3. Enter any email/password
4. Explore the dashboard!

---

## 🌐 Deploy to Production

### Backend (Render - 2 minutes)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → Sign up
3. New Web Service → Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Click "Create Web Service"
6. Copy your API URL

### Frontend (Vercel - 2 minutes)

1. Update `frontend/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```

2. Push to GitHub

3. Go to [vercel.com](https://vercel.com) → Import Project

4. Select your repo → Configure:
   - Root Directory: `frontend`
   - Framework: Next.js

5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com/api`

6. Deploy!

---

## ✅ Verify Deployment

### Test Backend
```bash
curl https://your-backend-url.onrender.com/health
```

Should return:
```json
{"status":"OK","timestamp":"..."}
```

### Test Frontend
Visit: `https://your-app.vercel.app`

- ✅ Login works
- ✅ Dashboard loads
- ✅ Calendar shows events
- ✅ All features work

---

## 🎉 You're Done!

Your Zenith Study Hub is live!

**Share your URLs:**
- 🌐 App: `https://your-app.vercel.app`
- 🔧 API: `https://your-backend-url.onrender.com`

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version (need 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### API not connecting
1. Check backend is running
2. Verify API URL in `frontend/src/lib/api.ts`
3. Check browser console for errors

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Review [backend/README.md](backend/README.md) for API docs

---

## 💡 Tips

- Use `npm run dev` for development (auto-reload)
- Use `npm start` for production
- Backend runs in mock mode (no database needed)
- All data resets on server restart

---

## 🆘 Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Open an issue on GitHub

---

**Happy coding! 🚀**
