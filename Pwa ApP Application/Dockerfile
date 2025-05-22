# Stage 1: Build the React app
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
COPY packages ./packages

# Navigate to your specific project directory (if using Yarn workspaces)
WORKDIR /app/packages/ecotime_pwa

# Install npm and yarn, and finally install yarn globally (this is now done in ecotime_pwa directory)

RUN npm install && \
    yarn install 

# Install dependencies and build the project
# RUN yarn install && yarn build:prod
RUN yarn workspace ecotime_pwa build:prod

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=builder /app/packages/ecotime_pwa/dist /usr/share/nginx/html

# Expose the port Nginx will serve on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
