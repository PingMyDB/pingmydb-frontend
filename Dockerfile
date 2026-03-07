# Frontend Dockerfile for PingMyDB
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
ARG VITE_API_URL=https://pingmydb-backend-xozimayiwa-uc.a.run.app
ARG VITE_RAZORPAY_KEY_ID=rzp_test_SGARUU9kB6bEWB
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
