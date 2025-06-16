
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Import Prisma client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('Connecting to database...');
    await prisma.$connect();
    
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      await prisma.$disconnect();
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('adminadmin', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin',
        username: 'admin',
        password_hash: hashedPassword,
        is_admin: true,
        preferences: {},
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    console.log('Admin user created successfully:', adminUser.username);
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

createAdminUser();
