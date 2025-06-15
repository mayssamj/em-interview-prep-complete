#!/bin/bash
set -e

echo "Starting the application..."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
fi

# Generate Prisma client if not already generated
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building application..."
yarn build

# Start the application
echo "Starting application on port 3000..."
yarn start
