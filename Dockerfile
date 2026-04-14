FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including vite/build tools)
RUN npm install

# Fix execute permissions on CLI binaries (required on Alpine Linux)
RUN chmod -R +x node_modules/.bin/

# Copy source files
COPY . .

# Build the React frontend
RUN npm run build

# Expose the API port
EXPOSE 3001

# Start the Express server (serves both API + built frontend)
CMD ["node", "server.mjs"]
