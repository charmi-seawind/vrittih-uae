# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy rest of the project
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built assets and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Run Next.js
CMD ["npm", "start"]
