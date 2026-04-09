# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY astro/package.json astro/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY astro/ ./

# Build Astro
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Install utilities for startup script
RUN apk add --no-cache gettext curl bash

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
