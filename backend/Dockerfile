### Base Stage ###
FROM node:26-alpine AS base

# Starting Node v25, Corepack is no longer shipped by default
RUN npm install -g corepack \
    corepack enable

### Build Stage ###
FROM base AS builder

# Set work directory and copy required files
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json oxlint.config.ts ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build project
COPY . .
RUN pnpm build

### Production Stage ###
FROM base AS production

# Set work directory
WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy required files and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built project files
COPY --from=builder /app/dist ./dist

# Create logs directory and transfer ownership of /app to node user
RUN mkdir -p /app/logs \
 && chown -R node:node /app

# Switch to node user
USER node

# Start the dumb-init process in order to handle PID 1 signals properly
ENTRYPOINT ["dumb-init", "--"]

# Define the project's start script
CMD ["node", "dist/index.js"]