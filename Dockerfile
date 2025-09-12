# Multi-stage build for FHEVM-NFT application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat wget
WORKDIR /app

# Copy all necessary files for workspace setup and scripts
COPY package*.json ./
COPY scripts/ ./scripts/
COPY packages/site/package*.json ./packages/site/
COPY packages/site/scripts/ ./packages/site/scripts/
COPY packages/fhevm-hardhat-template/package*.json ./packages/fhevm-hardhat-template/

# Install all dependencies first (including dev dependencies for build)
# Set environment variable to skip ABI generation during Docker build
ENV SKIP_ABI_GENERATION=true
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fix script permissions
RUN find . -name "*.sh" -type f -exec chmod +x {} \;

# Build the application (skip ABI generation as we have placeholders)
WORKDIR /app/packages/site
# Set environment variables to skip ESLint during build
ENV ESLINT_NO_DEV_ERRORS=true
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build structure
COPY --from=builder --chown=nextjs:nodejs /app/packages/site/.next/standalone ./

# Copy the static files
COPY --from=builder --chown=nextjs:nodejs /app/packages/site/.next/static ./packages/site/.next/static

# Copy public files
COPY --from=builder --chown=nextjs:nodejs /app/packages/site/public ./packages/site/public

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/packages/site
CMD ["sh", "-c", "PORT=3001 node server.js"]
