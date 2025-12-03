#!/bin/bash

# Test Docker Build Script for Megabyte Mentors Backend
# This script tests if your Docker image builds correctly before deploying to Render.com

set -e  # Exit on error

echo "🐳 Testing Docker build for Megabyte Mentors Backend..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Build the Docker image
echo "📦 Building Docker image..."
echo "This may take 5-10 minutes on first build..."
echo ""

if docker build -f apps/my-express-api/Dockerfile -t megabyte-mentors-api:test . ; then
    echo ""
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Docker build failed!${NC}"
    echo "Check the error messages above."
    exit 1
fi

# Check the image size
echo "📊 Image Information:"
docker images megabyte-mentors-api:test --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo ""

# Optionally run the container for testing
echo -e "${YELLOW}Do you want to test run the container? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "⚙️  Starting container..."
    echo "Note: This will fail if you don't have MongoDB running locally or MONGO_URI set"
    echo ""

    docker run --rm \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e PORT=3000 \
        -e MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/megabyte-mentors}" \
        -e TOKEN_SECRET="${TOKEN_SECRET:-test-secret-change-in-production}" \
        megabyte-mentors-api:test
else
    echo ""
    echo -e "${GREEN}✅ Build test complete!${NC}"
    echo ""
    echo "Your Docker image is ready to deploy to Render.com"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Follow the deployment guide in RENDER_DEPLOYMENT_GUIDE.md"
    echo ""
fi

# Cleanup
echo "🧹 Cleanup: Remove test image? (y/n)"
read -r cleanup

if [[ "$cleanup" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker rmi megabyte-mentors-api:test
    echo -e "${GREEN}✅ Test image removed${NC}"
fi
