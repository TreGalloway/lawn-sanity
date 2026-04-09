# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY astro/package.json astro/package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY astro/ ./

# Build Astro (SSR)
RUN npm run build

# Runtime stage - minimal Node runtime
FROM node:22-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY astro/package.json astro/package-lock.json* ./
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 8080

ENV PORT=8080
ENV HOST=0.0.0.0

CMD ["node", "dist/server/entry.mjs"]