#!/bin/bash

# Use Railway's PORT or default to 8080
export PORT=${PORT:-8080}

# Generate nginx config from template with actual PORT value
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx immediately (so health checks pass from second 0)
nginx -g 'daemon off;'
