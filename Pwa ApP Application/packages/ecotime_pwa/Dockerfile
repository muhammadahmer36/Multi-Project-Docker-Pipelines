# FROM node:20-alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and yarn.lock first for dependency caching
# COPY package*.json ./
# COPY yarn.lock ./

# # Install Yarn globally (if needed)

# RUN npm cache clean --force
# RUN npm install
# RUN yarn install




# # Install dependencies

# # Copy the rest of your application code
# COPY . .

# # # Build the application
# # RUN yarn workspace ecotime_pwa build:prod

# # Expose the port your app runs on
# EXPOSE 5173

# # Start the application using the command you use locally
# CMD ["yarn", "workspace", "ecotime_pwa", "production"]




# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the root-level package.json and yarn.lock from the root (adjust path to go up one level)
COPY ../../package.json ../../yarn.lock ./

# Copy the packages directory from the root
COPY ../../packages ./packages

# Install dependencies for all workspaces from the root
RUN yarn install --frozen-lockfile

# Set the working directory to the ecotime_pwa project inside the container
WORKDIR /usr/src/app/packages/ecotime_pwa

# Build the ecotime_pwa project
RUN yarn workspace ecotime_pwa build:prod

# Expose the port for the app (adjust as needed)
EXPOSE 3000

# Run the ecotime_pwa app in production mode
CMD ["yarn", "workspace", "ecotime_pwa", "production"]

