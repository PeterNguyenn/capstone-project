# Quick Docker Test Commands

Copy and paste these commands to test your Docker build.

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Build the image (5-10 mins first time)
docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test .

# 2. Run the container (replace MONGO_URI with yours)
docker run --rm -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/megabyte-mentors" \
  -e TOKEN_SECRET="test-secret-123" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  megabyte-mentors-api:test

# 3. Test (open new terminal)
curl http://localhost:3000/health
```

---

## ✅ Expected Results

### Successful Build
```
✅ Successfully tagged megabyte-mentors-api:test
```

### Successful Run
```
Listening at http://localhost:3000/api
Connected to MongoDB
```

### Successful Health Check
```json
{"status":"healthy","details":{"database":"connected"}}
```

---

## 🧹 Cleanup

```bash
# Stop container (Ctrl+C in running terminal)

# Remove test image
docker rmi megabyte-mentors-api:test

# (Optional) Clean Docker cache
docker system prune
```

---

## 🐛 If Something Fails

1. **Build fails?** Check the error message
2. **Can't connect to MongoDB?** Check MONGO_URI is correct
3. **Container crashes?** Run: `docker logs <container-id>`

See full troubleshooting in `TEST_DOCKER.md`
