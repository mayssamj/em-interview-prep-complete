#!/bin/bash
set -e

echo "=== EM Interview Prep - Complete Setup ==="
echo "This script will set up the entire application from scratch"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Please do not run this script as root"
    exit 1
fi

# Install PostgreSQL
echo "Step 1: Installing PostgreSQL..."
chmod +x scripts/install_postgresql.sh
./scripts/install_postgresql.sh

# Install Node.js
echo "Step 2: Installing Node.js..."
chmod +x scripts/install_nodejs.sh
./scripts/install_nodejs.sh

# Setup database
echo "Step 3: Setting up database..."
chmod +x scripts/setup_database.sh
./scripts/setup_database.sh

# Start application
echo "Step 4: Starting application..."
chmod +x scripts/start_app.sh
./scripts/start_app.sh

echo ""
echo "=== Setup Complete! ==="
echo "The application should now be running on http://localhost:3000"
