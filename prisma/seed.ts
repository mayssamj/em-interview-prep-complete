
import { seedDatabase } from '../lib/seed';

async function main() {
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import('../lib/db');
    await prisma.$disconnect();
  });
