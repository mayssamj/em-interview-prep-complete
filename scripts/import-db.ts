import { PrismaClient } from '@prisma/client';
import fs from 'fs';

(async () => {
  const prisma = new PrismaClient();
  const [file] = process.argv.slice(2);
  if (!file) {
    console.error('Usage: import-db.ts <path-to-json>');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const user of data.users || []) {
    await prisma.users.create({ data: user });
  }
  console.log('Import complete');
  await prisma.$disconnect();
})();
