# Quick Deploy to Render.com - 5 Minutes ⚡

Super fast deployment guide for Megabyte Mentors backend.

---

## ⚡ 5-Step Quick Deploy

### 1️⃣ Sign Up (1 min)
- Go to: **https://render.com**
- Sign up with **GitHub**
- Authorize Render

### 2️⃣ Create Web Service (1 min)
- Click **"New +"** → **"Web Service"**
- Connect your `megabyte-mentors` repository
- Click **"Connect"**

### 3️⃣ Configure Service (2 mins)

**Basic Settings:**
```
Name: megabyte-mentors-api
Region: Oregon (US West)
Branch: main
Environment: Docker
Instance Type: Free
```

**Environment Variables** (click "Add Environment Variable"):
```bash
MONGO_URI=mongodb+srv://[user]:[pass]@[cluster].mongodb.net/megabyte-mentors
TOKEN_SECRET=[generate with: openssl rand -base64 32]
PORT=3000
NODE_ENV=production
```

### 4️⃣ Deploy (1 min)
- Click **"Create Web Service"**
- Wait 5-10 minutes for build

### 5️⃣ Test (30 sec)
```bash
curl https://your-app-name.onrender.com/health
```

Expected:
```json
{"status":"healthy","details":{"database":"connected"}}
```

---

## ✅ Done!

Your API is live at:
```
https://your-app-name.onrender.com
```

---

## 🔧 Next: Update Mobile App

Update API URL in your mobile app:

**File:** `apps/megabyte-mentors/src/api/axios-config.ts`

```typescript
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

---

## 🐛 Not Working?

**Top 3 Issues:**

1. **Database connection failed**
   - ✅ Check MongoDB Atlas → Network Access → Allow 0.0.0.0/0

2. **Health check returns 503**
   - ✅ Check Render Logs for errors
   - ✅ Verify MONGO_URI is correct

3. **Build failed**
   - ✅ Check Render build logs
   - ✅ Ensure Dockerfile path is correct

---

## 📚 Full Guide

For detailed instructions, see: **RENDER_DEPLOYMENT_GUIDE.md**

---

**That's it! Your backend is deployed! 🎉**
