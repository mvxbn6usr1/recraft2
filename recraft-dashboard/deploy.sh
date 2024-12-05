#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create production directory if it doesn't exist
mkdir -p /var/www/recraft-dashboard

# Copy necessary files
echo "Copying files..."
cp -r dist /var/www/recraft-dashboard/

# Set up Nginx configuration
echo "Setting up Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/recraft-dashboard
sudo ln -sf /etc/nginx/sites-available/recraft-dashboard /etc/nginx/sites-enabled/

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment complete!" 