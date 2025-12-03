# How to Test Your Dockerfile

This guide shows you how to test your Dockerfile locally before deploying to Render.com.

---

## ✅ Prerequisites Check

Docker is installed and running on your machine!

---

## 🚀 Method 1: Quick Test (Recommended)

Use the automated test script I created:

```bash
# Run the test script
./test-docker-build.sh
```

**What it does:**
1. ✅ Verifies Docker is running
2. ✅ Builds the Docker image
3. ✅ Shows image size
4. ✅ Optionally runs the container
5. ✅ Cleans up test images

**Expected output:**
```
🐳 Testing Docker build for Megabyte Mentors Backend...
✅ Docker is running
📦 Building Docker image...
[+] Building 120.5s
✅ Docker image built successfully!
```

---

## 🔧 Method 2: Manual Step-by-Step

### Step 1: Build the Docker Image

```bash
# Build the image (this takes 5-10 minutes first time)
docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

**Expected output:**
```
[+] Building 120.5s (19/19) FINISHED
 => [deps 1/4] FROM docker.io/library/node:20-alpine
 => [deps 2/4] RUN apk add --no-cache python3 make g++
 => [deps 3/4] COPY package.json package-lock.json ./
 => [deps 4/4] RUN npm ci
 => [build 1/4] COPY --from=deps /app/node_modules ./node_modules
 => [build 2/4] COPY package.json package-lock.json ./
 => [build 3/4] COPY nx.json ./
 => [build 4/4] COPY apps/my-express-api ./apps/my-express-api/
 => [build 5/5] RUN npx nx build my-express-api --configuration=production
 => [production 1/4] RUN apk add --no-cache dumb-init
 => [production 2/4] COPY --from=build --chown=node:node /app/dist/apps/my-express-api ./
 => [production 3/4] RUN npm ci --omit=dev
 => exporting to image
 => => naming to docker.io/library/megabyte-mentors-api:test
```

**If successful:** You'll see "Successfully tagged megabyte-mentors-api:test"

**If it fails:** Read the error message carefully. Common issues below.

### Step 2: Check the Built Image

```bash
# List your images
docker images | grep megabyte-mentors-api

# Should show:
# megabyte-mentors-api   test   <IMAGE_ID>   2 minutes ago   ~200-300 MB
```

### Step 3: Run the Container (Test Mode)

**Important:** You need a MongoDB connection string for this step.

#### Option A: Test with MongoDB Atlas (Recommended)

```bash
# Replace with your actual MongoDB URI
export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/megabyte-mentors"
export TOKEN_SECRET="test-secret-for-local-testing"

# Run the container
docker run --rm -p 3000:3000 \
  -e MONGO_URI="$MONGO_URI" \
  -e TOKEN_SECRET="$TOKEN_SECRET" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test
```

#### Option B: Test without MongoDB (Limited)

```bash
# This will start but fail to connect to database
docker run --rm -p 3000:3000 \
  -e MONGO_URI="mongodb://fake:27017/test" \
  -e TOKEN_SECRET="test-secret" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test
```

**Expected output:**
```
Listening at http://localhost:3000/api
Connected to MongoDB  # (if MongoDB is accessible)
```

Press `Ctrl+C` to stop the container.

### Step 4: Test the API Endpoints

Open a **new terminal** (keep the container running) and test:

```bash
# Test 1: Health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"healthy","details":{"database":"connected"}}

# Test 2: Welcome endpoint
curl http://localhost:3000/api

# Expected response:
# {"message":"Welcome!"}

# Test 3: Auth endpoint (should return 404 for GET)
curl http://localhost:3000/api/auth

# Expected response:
# Cannot GET /api/auth (this is correct - POST is needed)
```

### Step 5: Cleanup

```bash
# Stop the container (Ctrl+C in the running terminal)

# Remove the test image
docker rmi megabyte-mentors-api:test

# (Optional) Clean up Docker build cache
docker builder prune
```

---

## 🐛 Method 3: Debug Build Issues

If the build fails, you can debug step-by-step:

### Check Build Context

```bash
# See what files Docker sees (should NOT include node_modules)
docker build -f apps/my-express-api/Dockerfile -t test --no-cache --progress=plain . 2>&1 | head -50
```

### Build Without Cache

```bash
# Force rebuild everything (slower but catches issues)
docker build --no-cache -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

### Build Only Stage 1 (Dependencies)

```bash
# Test just the deps stage
docker build --target deps -f apps/my-express-api/Dockerfile -t test-deps .
```

### Build Only Stage 2 (Build)

```bash
# Test up to build stage
docker build --target build -f apps/my-express-api/Dockerfile -t test-build .
```

### Inspect a Failed Build

```bash
# If build fails at a specific step, you can inspect the last successful layer
docker ps -a  # Find the container ID
docker commit <container-id> debug-image
docker run -it debug-image sh  # Explore the filesystem
```

---

## 📊 Method 4: Advanced Testing

### Test with Docker Compose (Optional)

Create `docker-compose.test.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/my-express-api/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - TOKEN_SECRET=test-secret-change-in-prod
      - NODE_ENV=production
      - PORT=3000
```

Then run:

```bash
# Build and run
docker-compose -f docker-compose.test.yml up --build

# Stop and remove
docker-compose -f docker-compose.test.yml down
```

### Check Image Layers

```bash
# Inspect the image
docker inspect megabyte-mentors-api:test

# Check image history (see layer sizes)
docker history megabyte-mentors-api:test

# Should show:
# - deps stage layers
# - build stage layers
# - production stage layers (final image)
```

### Test Container Health

```bash
# Run in detached mode
docker run -d --name test-api \
  -p 3000:3000 \
  -e MONGO_URI="$MONGO_URI" \
  -e TOKEN_SECRET="test-secret" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test

# Check logs
docker logs test-api

# Check if it's running
docker ps

# Test endpoint
curl http://localhost:3000/health

# Stop and remove
docker stop test-api
docker rm test-api
```

---

## ❌ Common Issues & Solutions

### Issue 1: Build fails with "Cannot find module 'nx'"

**Error:**
```
Error: Cannot find module '@nx/devkit'
```

**Cause:** npm dependencies not installed properly

**Solution:**
```bash
# Clear Docker cache and rebuild
docker builder prune -a
docker build --no-cache -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

### Issue 2: Build fails with "COPY failed"

**Error:**
```
COPY failed: file not found in build context
```

**Cause:** Missing files or wrong build context

**Solution:**
```bash
# Ensure you're running from project root
pwd  # Should show: /Users/peter/Documents/School proj/megabyte-mentors

# Check if files exist
ls package.json nx.json tsconfig.base.json apps/my-express-api/Dockerfile

# Rebuild from correct location
docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

### Issue 3: Container starts but crashes immediately

**Error:**
```
Container exits with code 1
```

**Cause:** Missing or invalid environment variables

**Solution:**
```bash
# Check logs
docker logs <container-id>

# Make sure MONGO_URI is valid
echo $MONGO_URI  # Should show your connection string

# Run with proper env vars
docker run --rm -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e TOKEN_SECRET="your-secret" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test
```

### Issue 4: "Error: connect ECONNREFUSED" (Database)

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Cause:** Can't connect to MongoDB

**Solutions:**
1. Check MONGO_URI is correct
2. MongoDB Atlas: Whitelist your IP (or 0.0.0.0/0)
3. Check username/password in connection string
4. Test connection string separately:
   ```bash
   mongosh "$MONGO_URI"
   ```

### Issue 5: Build is very slow

**Cause:** Normal for first build (installing all dependencies)

**Expected times:**
- First build: 5-10 minutes
- Subsequent builds: 2-3 minutes (cached)

**Speed up:**
```bash
# Use BuildKit (faster)
DOCKER_BUILDKIT=1 docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .
```

### Issue 6: "npm ci" fails in production stage

**Error:**
```
npm ERR! The `npm ci` command can only install with an existing package-lock.json
```

**Cause:** Nx didn't generate package.json properly

**Solution:** Check webpack.config.js has:
```javascript
generatePackageJson: true
```

Already configured ✅

---

## ✅ Success Checklist

Your Docker build is successful if:

- [ ] Build completes without errors
- [ ] Image is created (check with `docker images`)
- [ ] Image size is reasonable (~200-300 MB)
- [ ] Container starts without crashes
- [ ] `/health` endpoint returns `{"status":"healthy"}`
- [ ] `/api` endpoint returns `{"message":"Welcome!"}`
- [ ] MongoDB connection works (if MONGO_URI provided)
- [ ] Logs show no errors

---

## 🎯 Quick Test Commands (Copy-Paste)

```bash
# 1. Build
docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .

# 2. Run (replace with your MONGO_URI)
docker run --rm -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/megabyte-mentors" \
  -e TOKEN_SECRET="test-secret-123" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test

# 3. Test (in another terminal)
curl http://localhost:3000/health
curl http://localhost:3000/api

# 4. Cleanup
docker rmi megabyte-mentors-api:test
```

---

## 📝 What to Look For

### Successful Build Output

You should see these stages:
```
✅ [deps 1/4] FROM docker.io/library/node:20-alpine
✅ [deps 4/4] RUN npm ci
✅ [build 5/5] RUN npx nx build my-express-api
✅ [production 3/4] RUN npm ci --omit=dev
✅ Successfully tagged megabyte-mentors-api:test
```

### Successful Container Start

You should see:
```
✅ Listening at http://localhost:3000/api
✅ Connected to MongoDB
```

### Successful Health Check

```bash
$ curl http://localhost:3000/health
{"status":"healthy","details":{"database":"connected"}}
```

---

## 🚀 Ready for Render?

If all tests pass:
1. ✅ Commit your changes
2. ✅ Push to GitHub
3. ✅ Follow `QUICK_DEPLOY.md` to deploy to Render.com

If tests fail:
1. ❌ Check error messages above
2. ❌ Review common issues section
3. ❌ Fix issues and rebuild
4. ❌ Test again

---

**Need help?** Check the error message and search for it in the "Common Issues" section above!
