#!/bin/bash
# EM Interview Prep - Database Reset Script

set -e

echo "🔄 Resetting database..."

if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ No Prisma schema found"
    exit 1
fi

# Reset database
echo "🗑️  Dropping existing database..."
npx prisma db push --force-reset --accept-data-loss

echo "🔨 Recreating database schema..."
npx prisma db push

echo "🌱 Seeding with fresh data..."
./scripts/seed.sh

echo "✅ Database reset completed!"
