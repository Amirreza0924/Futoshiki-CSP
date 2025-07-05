ARG NODE_VERSION=20.12.2

# --- Builder stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies
COPY --link package.json package-lock.json ./
RUN npm config set strict-ssl false && npm ci --production=false

# Copy the rest of the app source
COPY --link . .

# Build the app (runs tsc and vite build)
RUN npm run build

# --- Production stage ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install only vite for preview
RUN npm config set strict-ssl false && npm install vite

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
USER appuser

# Vite preview defaults to port 5173
EXPOSE 5173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
