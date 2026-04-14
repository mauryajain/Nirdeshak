FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including vite/build tools)
RUN npm install

# Copy source files
COPY . .

# Build the React frontend — call node directly to bypass .bin symlink permission issues
RUN node node_modules/vite/bin/vite.js build

# Expose the API port
EXPOSE 3001

# Start the Express server (serves both API + built frontend)
CMD ["node", "server.mjs"]
