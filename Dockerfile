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

# Final stage - serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ $uri.html =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
