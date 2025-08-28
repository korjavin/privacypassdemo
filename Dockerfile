# Build stage
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/

# Copy built assets from builder stage
COPY --from=builder /app/dist/ ./dist/

# Copy static images
COPY images/ ./images/

# Debug: List files to verify copying
RUN echo "=== Debug: Listing /app contents ===" && ls -la /app
RUN echo "=== Debug: Listing server directory ===" && ls -la /app/server
RUN echo "=== Debug: Checking node_modules noble libraries ===" && ls -la /app/node_modules/@noble/
RUN echo "=== Debug: Checking crypto.js imports ===" && head -10 /app/server/crypto.js

# Expose the port that the server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:server"]