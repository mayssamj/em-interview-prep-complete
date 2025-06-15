#!/bin/bash
set -e

echo "Setting up database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update the DATABASE_URL in .env file with your database credentials"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
yarn install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma db push

# Seed the database
echo "Seeding database..."
node seed-simple.js

echo "Database setup completed!"
