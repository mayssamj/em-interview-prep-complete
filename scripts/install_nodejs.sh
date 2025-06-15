#!/bin/bash
set -e

echo "Installing Node.js and npm..."

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Verify installations
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Yarn version: $(yarn --version)"

echo "Node.js installation completed!"
