# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies for both backend and frontend
COPY backend/package.json backend/package-lock.json* ./backend/
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY package.json package-lock.json* ./

RUN cd backend && npm ci --only=production && npm cache clean --force
RUN cd frontend && npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY package.json ./

# Build backend
WORKDIR /app/backend
RUN npm run build:prod

# Build frontend
WORKDIR /app/frontend
RUN npm run build:prod

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=nextjs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=nextjs:nodejs /app/backend/package.json ./backend/
COPY --from=deps --chown=nextjs:nodejs /app/backend/node_modules ./backend/node_modules

# Create logs directory
RUN mkdir -p logs && chown nextjs:nodejs logs

USER nextjs

# Expose port
EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "backend/dist/index.js"]