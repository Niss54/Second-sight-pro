# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for sharp or canvas if required
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install native dependencies required in production
RUN apk add --no-cache libc6-compat poppler-utils ghostscript tesseract-ocr

ENV NODE_ENV=production

# Copy only production dependencies and built code
COPY package*.json ./
RUN npm ci --only=production

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Create necessary directories
RUN mkdir -p data/corpus

# Ensure non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
