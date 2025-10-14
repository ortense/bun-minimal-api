# Stage 1: Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy the dependency files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --production --frozen-lockfile

# Copy the source code
COPY src ./src

# Compile the app
RUN bun compile

# Stage 2: Runtime
FROM alpine:3.20 AS runtime

WORKDIR /app

# Install minimal system dependencies (required for the Bun binary)
RUN apk add --no-cache \
    ca-certificates \
    libstdc++ \
    libgcc

# Copy only the compiled binary from the previous stage
COPY --from=builder /app/dist/app /app/app

# Create directory for the database
RUN mkdir -p /app/data

# Environment variables
ENV PORT=4321
ENV DATABASE_URL=sqlite:///app/data/sqlite.db

# Export the port
EXPOSE 4321

# Run the application
CMD ["/app/app"]

