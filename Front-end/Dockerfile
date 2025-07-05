ARG NODE_VERSION=22.13.1

# --- Builder stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (npm ci for deterministic builds)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the app source
COPY --link . .

# Build the app (runs tsc and vite build)
RUN npm run build

# Remove dev dependencies to reduce image size
RUN rm -rf node_modules && \
    npm ci --omit=dev

# --- Production stage ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
USER appuser

# Vite preview defaults to port 5173
EXPOSE 5173

CMD ["npx", "vite", "preview", "--host"]
