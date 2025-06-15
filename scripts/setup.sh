#!/bin/bash
# EM Interview Prep - Complete Setup Script

set -e

echo "🚀 Starting EM Interview Prep Setup..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database and other configuration details"
else
    echo "✅ Environment file already exists"
fi

# Setup database
echo "🗄️  Setting up database..."
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    npx prisma db push
    echo "✅ Database schema applied"
else
    echo "⚠️  No Prisma schema found, skipping database setup"
fi

# Build application
echo "🔨 Building application..."
npm run build

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run seed' to populate database with sample data"
echo "3. Run 'npm run dev' to start development server"
echo "4. Visit http://localhost:3000"
