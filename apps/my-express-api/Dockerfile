# Base development image
FROM node:20.5-alpine3.18 AS base

RUN apk add --no-cache \
  dumb-init=1.2.5-r2

FROM base AS node-common

WORKDIR /src
# Install dependencies needed for development
RUN apk add --no-cache \
  python3 \
  make \
  gcc \
  g++

COPY package.json \
  tsconfig* \
  nx.json \
  eslint.config* \
  jest* \
  package-lock.json \
  ./

RUN npm i

FROM node-common AS server-build

COPY apps/my-express-api ./apps/my-express-api/
RUN npx nx run my-express-api:build:production

FROM base AS server-prod
LABEL description="The server side code for the Unteris website. It runs a NestJS server and connects to a redis and postgres database"
USER node
WORKDIR /src
COPY --from=server-build --chown=node:node /src/dist/apps/my-express-api ./
ENV NODE_ENV=production
RUN npm i
CMD ["dumb-init", "node", "main.js"]

# USER node

# # Command to run in development
# CMD ["npx", "nx", "serve", "my-express-api", "--watch"]

# # Build stage
# FROM base AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npx nx build my-express-api --prod

# # Production stage
# FROM node:18-alpine AS production
# WORKDIR /app
# # Copy only necessary files from build stage
# COPY --from=build /app/dist/apps/my-express-api ./
# COPY --from=build /app/package.json ./
# # Install only production dependencies
# RUN npm ci --only=production
# # Set NODE_ENV
# ENV NODE_ENV=production
# # Expose API port
# EXPOSE 3000
# # Command to run in production
# CMD ["node", "main.js"]


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
