# ==============================================
# Stage 1: Dependencies
# ==============================================
FROM node:20-alpine AS deps

# Install build dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# ==============================================
# Stage 2: Build
# ==============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy configuration files needed for Nx build
COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy the backend app source
COPY apps/my-express-api ./apps/my-express-api/

# Build the application using Nx
# This will output to dist/apps/my-express-api and generate a package.json
RUN npx nx build my-express-api --configuration=production

# ==============================================
# Stage 3: Production Runtime
# ==============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Run as non-root user for security
USER node
WORKDIR /app

# Copy the built application from build stage
COPY --from=build --chown=node:node /app/dist/apps/my-express-api ./

# Install only production dependencies
# (Nx generates a package.json with only prod deps in the dist folder)
RUN npm ci --omit=dev

# Set production environment
ENV NODE_ENV=production

# Expose port (Render will override this with PORT env var)
EXPOSE 3000

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "main.js"]
