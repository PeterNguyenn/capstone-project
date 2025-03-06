# Base development image
FROM node:18-alpine AS base
WORKDIR /app
# Install dependencies needed for development
RUN apk add --no-cache python3 make g++ git

# Development stage
FROM base AS development
# Install dependencies
COPY package*.json ./
RUN npm ci
# Copy source code
COPY . .
# Expose API port
EXPOSE 3000

USER node

# Command to run in development
CMD ["npx", "nx", "serve", "my-express-api", "--watch"]

# Build stage
FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build api --prod

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
# Copy only necessary files from build stage
COPY --from=build /app/dist/apps/my-express-api ./
COPY --from=build /app/package.json ./
# Install only production dependencies
RUN npm ci --only=production
# Set NODE_ENV
ENV NODE_ENV=production
# Expose API port
EXPOSE 3000
# Command to run in production
CMD ["node", "main.js"]


# FROM node:18 AS builder
# # Set working directory
# WORKDIR /app
# # Copy the root package.json and yarn.lock to install dependencies
# COPY package*.json ./
# # Install dependencies
# RUN npm install
# # Copy the entire monorepo to the container
# COPY . .
# # Build the NestJS app
# RUN npx nx build my-express-api --prod
# # Use a lightweight Node.js image for the production environment
# FROM node:18-alpine
# # Set working directory
# WORKDIR /app
# # Copy the build output and install only production dependencies
# COPY --from=builder /app/dist/apps/my-express-api /app
# COPY --from=builder /app/node_modules /app/node_modules
# # Expose the backend port
# EXPOSE 3000
# # Start the NestJS app
# CMD ["node", "main.js"]
