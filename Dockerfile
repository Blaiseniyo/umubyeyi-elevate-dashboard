FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker's layer caching.
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies needed for the build)
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Run the build script defined in package.json
RUN yarn build


# --- Stage 2: Production image ---
# Start from a fresh, lightweight Node.js Alpine image for the final container
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency manifests again
COPY package.json yarn.lock ./

# Install ONLY production dependencies to keep the final image small and secure
RUN yarn install --frozen-lockfile --production

# Copy the built application assets from the 'build' stage
# The path /app/dist should match the output directory of your 'yarn build' command.
# For Next.js this might be /app/.next, for Vite it's often /app/dist
COPY --from=build /app/dist ./dist

# Expose the port your application runs on (3000 is a common default)
EXPOSE 3000

# The command to start the application.
# This will execute the "start" script in your package.json.
CMD ["yarn", "start"]
