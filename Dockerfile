# Multi-stage build for React + Express application
FROM node:18-alpine AS build

# Add build argument for commit SHA
ARG COMMIT_SHA=unknown

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for build
RUN npm ci

# Copy source code
COPY . .

# Replace the placeholder in the main HTML file with the commit SHA
RUN sed -i "s/__COMMIT_SHA__/${COMMIT_SHA}/g" /app/index.html

# Build the React application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

# Expose the port that the server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:server"]