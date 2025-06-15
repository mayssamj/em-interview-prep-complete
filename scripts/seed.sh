#!/bin/bash
# EM Interview Prep - Database Seeding Script

set -e

echo "🌱 Seeding database with exported data..."

if [ ! -f "backup/database-export.json" ]; then
    echo "❌ No database export file found at backup/database-export.json"
    exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ No Prisma schema found"
    exit 1
fi

# Create seeding script
cat > prisma/seed.js << 'SEED_EOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    const exportPath = path.join(__dirname, '..', 'backup', 'database-export.json');
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    
    console.log('📊 Seeding companies...');
    for (const company of data.companies || []) {
      await prisma.company.upsert({
        where: { id: company.id },
        update: company,
        create: company,
      });
    }
    
    console.log('❓ Seeding questions...');
    for (const question of data.questions || []) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: question,
        create: question,
      });
    }
    
    console.log('👥 Seeding users...');
    for (const user of data.users || []) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    
    console.log('📖 Seeding stories...');
    for (const story of data.stories || []) {
      await prisma.story.upsert({
        where: { id: story.id },
        update: story,
        create: story,
      });
    }
    
    console.log('🎤 Seeding interviews...');
    for (const interview of data.interviews || []) {
      await prisma.interview.upsert({
        where: { id: interview.id },
        update: interview,
        create: interview,
      });
    }
    
    console.log('📝 Seeding notes...');
    for (const note of data.notes || []) {
      await prisma.interviewNote.upsert({
        where: { id: note.id },
        update: note,
        create: note,
      });
    }
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEED_EOF

# Run the seeding
node prisma/seed.js

echo "✅ Database seeding completed!"
