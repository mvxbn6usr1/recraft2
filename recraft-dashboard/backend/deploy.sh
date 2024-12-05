#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create production directory if it doesn't exist
mkdir -p /var/www/recraft-api

# Copy necessary files
echo "Copying files..."
cp -r dist package.json package-lock.json .env.production /var/www/recraft-api/

# Change to production directory
cd /var/www/recraft-api

# Rename environment file
mv .env.production .env

# Install production dependencies
echo "Installing dependencies..."
npm ci --only=production

# Restart the application (assuming PM2 is used)
echo "Restarting the application..."
pm2 restart recraft-api || pm2 start dist/index.js --name recraft-api

echo "Deployment complete!" 