# syntax = docker/dockerfile:1

# Multi-stage Dockerfile for Remix app with Prisma and SQLite

# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies needed for native modules and OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ openssl

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma/schema.sqlite.prisma ./prisma/
RUN npx prisma generate --schema=./prisma/schema.sqlite.prisma

# Copy application source
COPY . .

# Build CSS and Remix app
RUN npm run build:css
RUN npm run build:remix

# Prune dev dependencies after build
# Note: @remix-run/serve is in devDeps but needed for production
# We keep it by reinstalling the matching version after prune
RUN npm prune --omit=dev && npm install @remix-run/serve@^2.17.2 --ignore-scripts

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup --system --gid 1001 remix && \
    adduser --system --uid 1001 remix

# Copy package.json for npm scripts
COPY package.json ./

# Copy node_modules from build stage (already pruned)
COPY --from=build /app/node_modules ./node_modules

# Copy Prisma schema and regenerate client for Alpine's OpenSSL version
COPY --from=build /app/prisma/schema.sqlite.prisma ./prisma/
RUN npx prisma generate --schema=./prisma/schema.sqlite.prisma

# Copy built application
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/app/tailwind.css ./app/tailwind.css

# Set ownership to non-root user
RUN chown -R remix:remix /app

USER remix

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Kamal requires service label
LABEL service="kelas"

# Start the application
# Using explicit path for CJS compatibility with Node 24
CMD ["npx", "remix-serve", "./build/index.js"]
