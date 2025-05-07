FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Create directories for static files
RUN mkdir -p dist/files dist/public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 