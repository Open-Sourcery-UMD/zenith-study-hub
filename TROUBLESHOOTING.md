# 🔧 Troubleshooting Guide

## Projects Page - Can't Add Project

### Issue
The "New Project" button opens the dialog, but clicking "Create Project" doesn't work.

### Root Cause
The frontend API URL was pointing to the wrong port.

### ✅ Fix Applied
Updated `frontend/src/lib/api.ts`:
```typescript
// Changed from port 3334 to 3336
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3336/api'
```

---

## How to Test

### 1. Make Sure Backend is Running
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 3336
📱 Visit: http://localhost:3336
```

### 2. Test Backend Directly
```bash
# Test projects endpoint
curl http://localhost:3336/api/projects \
  -H "Authorization: Bearer mock-jwt-token-123"

# Should return array of projects
```

### 3. Restart Frontend
**IMPORTANT:** You must restart the frontend to pick up the API URL change!

```bash
# Stop the frontend (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 4. Test in Browser
1. Go to http://localhost:3000
2. Login (any email/password)
3. Go to Projects page
4. Click "New Project"
5. Fill in the form
6. Click "Create Project"
7. Should see success message and new project appears!

---

## Common Issues

### Issue: "Failed to create project" error

**Cause:** Backend not running or wrong port

**Fix:**
1. Check backend is running: `curl http://localhost:3336/health`
2. Should return: `{"status":"OK","timestamp":"..."}`
3. If not, start backend: `cd backend && npm start`

### Issue: Dialog opens but nothing happens when clicking "Create Project"

**Cause:** Frontend not restarted after API URL change

**Fix:**
1. Stop frontend (Ctrl+C in terminal)
2. Restart: `npm run dev`
3. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Issue: CORS error in browser console

**Cause:** Backend CORS not configured for frontend URL

**Fix:** Backend already has CORS enabled for all origins, so this shouldn't happen. If it does:
1. Check backend console for errors
2. Make sure you're accessing frontend at http://localhost:3000

### Issue: "Network Error" in console

**Cause:** Backend not running or firewall blocking

**Fix:**
1. Verify backend is running
2. Check firewall settings
3. Try accessing http://localhost:3336/health directly in browser

---

## Debugging Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab

Look for:
- ❌ Red errors
- 🟡 Yellow warnings
- Network errors

### 2. Check Network Tab
DevTools → Network tab

When you click "Create Project":
1. Should see POST request to `/api/projects`
2. Status should be 201 (Created)
3. Response should contain the new project

If you see:
- **404**: Wrong API URL
- **500**: Backend error
- **CORS error**: CORS issue
- **Network Error**: Backend not running

### 3. Check Backend Console
Look at the terminal where backend is running

Should see:
```
POST /api/projects 201 - - 15.234 ms
```

If you see errors, that's the problem!

---

## Quick Test Script

Save this as `test-api.sh` and run it:

```bash
#!/bin/bash

echo "Testing Zenith Study Hub API..."
echo ""

# Test health
echo "1. Testing health endpoint..."
curl -s http://localhost:3336/health | python3 -m json.tool
echo ""

# Test login
echo "2. Testing login..."
curl -s -X POST http://localhost:3336/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' | python3 -m json.tool
echo ""

# Test projects
echo "3. Testing projects list..."
curl -s http://localhost:3336/api/projects \
  -H "Authorization: Bearer mock-jwt-token-123" | python3 -m json.tool
echo ""

# Test create project
echo "4. Testing create project..."
curl -s -X POST http://localhost:3336/api/projects \
  -H "Authorization: Bearer mock-jwt-token-123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing API","status":"active"}' | python3 -m json.tool
echo ""

echo "✅ All tests complete!"
```

Run with: `bash test-api.sh`

---

## Still Not Working?

### Check These:

1. **Backend Port**
   - Backend should be on port 3336
   - Check with: `lsof -i :3336`

2. **Frontend Port**
   - Frontend should be on port 3000
   - Check with: `lsof -i :3000`

3. **API URL in Code**
   - File: `frontend/src/lib/api.ts`
   - Should be: `http://localhost:3336/api`

4. **Browser Cache**
   - Clear cache
   - Hard refresh (Cmd+Shift+R)
   - Try incognito mode

5. **Token**
   - Check if token is set in cookies
   - DevTools → Application → Cookies
   - Should see `token` cookie

---

## Success Checklist

- [ ] Backend running on port 3336
- [ ] Frontend running on port 3000
- [ ] API URL updated to 3336
- [ ] Frontend restarted after API URL change
- [ ] Browser cache cleared
- [ ] Can see projects list
- [ ] "New Project" button opens dialog
- [ ] Can fill in form
- [ ] "Create Project" creates project
- [ ] Success toast appears
- [ ] New project appears in list

---

## Need More Help?

1. Check browser console for errors
2. Check backend console for errors
3. Run the test script above
4. Check TROUBLESHOOTING.md (this file)
5. Review FIXES.md for what was changed

---

**Remember:** Always restart the frontend after changing API configuration!
