# Dockerfile for Next.js project

# 1. Build stage
FROM node:24.4.0 AS builder

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy configuration files
COPY next.config.ts tsconfig.json postcss.config.mjs prisma.config.ts ./
COPY prisma ./prisma

# Copy source code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

# 2. Production stage
FROM node:24.4.0 AS runner

WORKDIR /app

# Copy files from builder stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules


# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
