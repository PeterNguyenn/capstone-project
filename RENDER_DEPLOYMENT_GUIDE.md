# Render.com Deployment Guide - Megabyte Mentors Backend

This guide will walk you through deploying your Express.js backend to Render.com (Free Tier).

---

## 📋 Prerequisites

Before you begin, make sure you have:
- [x] GitHub account with your code pushed
- [x] MongoDB Atlas cluster set up (with connection string)
- [x] All environment variables documented
- [x] Your repository is public OR you have a GitHub Pro account (for private repo deployment)
- [x] **NEW**: Optimized Dockerfile ready (already done! ✅)

### ✨ Dockerfile Recently Updated

Your Dockerfile has been optimized for Render.com deployment with:
- ✅ Multi-stage build for smaller image size
- ✅ Proper Nx monorepo support
- ✅ Security best practices (non-root user)
- ✅ Production-ready configuration

See `DOCKERFILE_CHANGES.md` for details on what changed.

---

## 🧪 Optional: Test Docker Build Locally (Recommended)

Before deploying to Render, you can test the Docker build on your local machine:

```bash
# Quick test using the provided script
./test-docker-build.sh

# Or manual test
docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

**Benefits of testing locally:**
- ✅ Catch build errors before deploying
- ✅ Verify all dependencies are correct
- ✅ Test the container runs properly
- ✅ Save time (local builds are faster than remote)

**Skip if:** You're confident or want to deploy directly (Render will show build logs)

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Render.com Account

1. Go to: **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up using your **GitHub account** (recommended for easy integration)
4. Authorize Render to access your GitHub repositories

### Step 2: Create a New Web Service

1. From your Render dashboard, click **"New +"** in the top right
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Find your repository: `megabyte-mentors`
   - Click **"Connect"**

### Step 3: Configure Your Web Service

Fill in the following settings:

| Setting | Value | Notes |
|---------|-------|-------|
| **Name** | `megabyte-mentors-api` | This will be part of your URL |
| **Region** | `Oregon (US West)` | Choose closest to your users |
| **Branch** | `main` | Your main git branch |
| **Root Directory** | Leave blank | We'll use Dockerfile from root |
| **Environment** | `Docker` | We have a Dockerfile |
| **Instance Type** | `Free` | Perfect for testing/demo |

### Step 4: Set Environment Variables

Click **"Advanced"** to expand, then scroll to **"Environment Variables"**.

Add the following variables (click **"Add Environment Variable"** for each):

#### Required Environment Variables:

```bash
# Database Connection
MONGO_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/megabyte-mentors?retryWrites=true&w=majority

# Security Token (Generate with: openssl rand -base64 32)
TOKEN_SECRET=your-super-secret-token-here-change-this

# Server Port (Render will use this)
PORT=3000

# Node Environment
NODE_ENV=production
```

#### Optional (if you're using these features):

```bash
# Email Service (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Expo Push Notifications (if implemented)
EXPO_ACCESS_TOKEN=your-expo-token-here
```

### Step 5: Deploy!

1. Review all settings
2. Click **"Create Web Service"** at the bottom
3. Render will start building your Docker image

**Expected build time:** 5-10 minutes for first deployment

### Step 6: Monitor Deployment

Watch the build logs in real-time:
- You'll see:
  - ✅ Cloning repository
  - ✅ Building Docker image
  - ✅ Installing dependencies
  - ✅ Starting server
  - ✅ Deploy successful!

### Step 7: Test Your Deployment

Once deployed, you'll get a URL like:
```
https://megabyte-mentors-api.onrender.com
```

Test these endpoints:

#### Health Check:
```bash
curl https://megabyte-mentors-api.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "details": {
    "database": "connected"
  }
}
```

#### Welcome Endpoint:
```bash
curl https://megabyte-mentors-api.onrender.com/api
```

Expected response:
```json
{
  "message": "Welcome!"
}
```

---

## 🔧 Important Configuration Notes

### Free Tier Limitations

⚠️ **Important:** Render.com Free Tier spins down after **15 minutes of inactivity**

**What this means:**
- First request after inactivity: **30-60 seconds delay** (cold start)
- Subsequent requests: Normal speed
- **Acceptable for demos and testing**

**Solution for production:**
- Upgrade to $7/month paid plan for always-on service
- Or implement a ping service to keep it alive

### CORS Configuration

Your backend already has CORS enabled in `main.ts`:
```typescript
app.use(cors());
```

If you need to restrict origins, update to:
```typescript
app.use(cors({
  origin: ['https://your-mobile-app-domain.com', 'http://localhost:8081']
}));
```

### MongoDB Atlas Whitelist

**IMPORTANT:** Add Render's IP to MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (for testing)
   - Or add Render's specific IPs (check Render docs for current IPs)
5. Click **"Confirm"**

---

## 🎯 Post-Deployment Steps

### 1. Update Mobile App API URL

In your mobile app, update the API base URL:

**File:** `apps/megabyte-mentors/src/api/axios-config.ts` (or similar)

```typescript
const API_BASE_URL = 'https://megabyte-mentors-api.onrender.com';
```

### 2. Test All API Endpoints

Test critical flows:
- ✅ User registration
- ✅ User login
- ✅ Mentor application submission
- ✅ Event creation (admin)
- ✅ Event registration (mentor)

### 3. Enable Auto-Deploy (Recommended)

Render automatically deploys on git push:
- ✅ Already enabled by default
- Every push to `main` branch triggers new deployment
- Takes 5-10 minutes per deployment

### 4. Set Up Notifications

Get notified about deployments:
1. Go to your service settings
2. Navigate to **"Notifications"**
3. Add your email
4. Get alerts for: Deploy success, failures, etc.

---

## 🐛 Troubleshooting

### Issue 1: Build Fails - "Cannot find module"

**Solution:** Your Dockerfile is building correctly, but if you see this:
1. Check that all dependencies are in root `package.json`
2. Make sure `npm install` runs during Docker build
3. Verify Nx build command: `npx nx run my-express-api:build:production`

### Issue 2: Database Connection Error

**Symptoms:** Logs show `MongooseError` or connection timeout

**Solutions:**
1. ✅ Verify `MONGO_URI` environment variable is correct
2. ✅ Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
3. ✅ Ensure username/password in connection string are correct
4. ✅ Make sure database user has read/write permissions

### Issue 3: 503 Service Unavailable

**Cause:** App crashed or failed to start

**Solutions:**
1. Check Render logs for errors
2. Verify `PORT` environment variable is set
3. Ensure `main.js` is in the correct path after build
4. Check that Dockerfile `CMD` is correct

### Issue 4: Slow First Request (Cold Start)

**This is normal!** Free tier spins down after 15 minutes.

**Solutions:**
- Upgrade to paid plan ($7/month)
- Implement a cron job to ping every 14 minutes
- Document this behavior for your client

---

## 📊 Monitoring Your Deployment

### View Logs

1. Go to your service dashboard
2. Click **"Logs"** tab
3. See real-time logs from your Express server

### Metrics (Free Tier)

Render provides basic metrics:
- CPU usage
- Memory usage
- Request counts
- Response times

### Health Checks

Render automatically monitors your `/health` endpoint:
- Configured automatically
- Pings every few minutes
- Alerts you if service is down

---

## 🔄 Making Updates

### Deploy New Changes

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend API"
   git push origin main
   ```
3. Render automatically detects the push
4. New deployment starts automatically
5. Wait 5-10 minutes for build

### Manual Deploy

If auto-deploy didn't trigger:
1. Go to your service dashboard
2. Click **"Manual Deploy"** button
3. Select branch: `main`
4. Click **"Deploy"**

### Rollback to Previous Version

If something breaks:
1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Rollback to this version"**
4. Confirm rollback

---

## 💰 Cost Breakdown

| Resource | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Web Service** | Free (750 hrs/mo) | $7/month (always-on) |
| **Bandwidth** | 100 GB/month | Unlimited |
| **Build Minutes** | 500 mins/month | Unlimited |
| **Custom Domain** | ✅ Included | ✅ Included |
| **Auto-deploy** | ✅ Included | ✅ Included |
| **SSL Certificate** | ✅ Free (auto) | ✅ Free (auto) |

**Your Cost for Capstone:** **$0**

---

## ✅ Deployment Checklist

Before presenting to stakeholders:

- [ ] Backend deployed successfully
- [ ] Health endpoint returns 200 OK
- [ ] Database connection working
- [ ] All API endpoints tested
- [ ] Mobile app connected to deployed backend
- [ ] CORS configured correctly
- [ ] Environment variables secured (not in code)
- [ ] Logs show no errors
- [ ] SSL certificate active (HTTPS working)
- [ ] Auto-deploy enabled
- [ ] Client has access to Render dashboard (add as team member)

---

## 🎓 Next Steps

1. ✅ Deploy backend (this guide)
2. ✅ Update mobile app with deployed API URL
3. ✅ Test all features end-to-end
4. ✅ Create demo video showing deployed app
5. ✅ Document deployment in transition plan
6. ✅ Present to stakeholders!

---

## 📚 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **Your deployed API:** https://megabyte-mentors-api.onrender.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Render Status:** https://status.render.com

---

## 🆘 Need Help?

**Check Render Logs First:**
- Dashboard → Your Service → Logs tab

**Common Issues:**
- 99% of issues are: wrong environment variables or MongoDB connection

**Still Stuck?**
- Render Community: https://community.render.com
- MongoDB Forums: https://www.mongodb.com/community/forums

---

**Good luck with your deployment! 🚀**
