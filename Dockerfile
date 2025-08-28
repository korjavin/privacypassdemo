# Production image for React + Express application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/

# Copy static assets (built by CI)
COPY dist/ ./dist/
COPY images/ ./images/

# Expose the port that the server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:server"]