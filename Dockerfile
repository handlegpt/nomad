# Multi-stage build - Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create public directory and copy files if they exist
RUN mkdir -p public
COPY --from=builder /app/public ./public

# Copy environment example file
COPY --from=builder /app/env.example ./env.example

# Set user permissions
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# 设置默认环境变量（可以在运行时覆盖）
ENV NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
ENV NEXT_PUBLIC_OPENWEATHER_API_KEY="your-openweather-api-key-here"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 