# Production Dockerfile for AI Newsroom (Firebase App Hosting / Cloud Run)
FROM node:20-alpine AS builder

WORKDIR /app

# Enable legacy peer deps for deterministic builds
COPY package*.json ./
COPY .npmrc ./

RUN npm install --legacy-peer-deps

COPY . .

# Build Vite static assets
RUN npm run build

# Production runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
COPY .npmrc ./

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps
RUN npm install -g tsx

# Copy compiled files and production server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
