import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

(async () => {
  const prisma = new PrismaClient();
  const data = {
    users: await prisma.users.findMany(),
    // TODO: add other models
  };
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.join('exports', ts);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'data.json'), JSON.stringify(data, null, 2));
  console.log(`Exported data to ${dir}`);
  await prisma.$disconnect();
})();
