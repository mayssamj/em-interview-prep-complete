
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const prisma = new PrismaClient();

async function testMiddleware() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNGViZWFkMy01MjNjLTRhODQtYWMxNS04YjBjNDg5Y2FjYmMiLCJ1c2VybmFtZSI6ImRlbW8iLCJpc0FkbWluIjowLCJpYXQiOjE3NTAxMjM0NzcsImV4cCI6MTc1MDIwOTg3N30.B7PfXIWipUkMDOsEx9FID97j5JX90ep6x_AGyJkwhB8';
    
    console.log('1. Testing JWT verification...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('JWT decoded successfully:', decoded);
    
    console.log('2. Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');
    
    console.log('3. Testing user lookup...');
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        is_admin: true,
        preferences: true,
      }
    });
    
    console.log('User found:', user);
    
    if (user) {
      const sessionUser = {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
        email: user.preferences?.email || undefined,
      };
      console.log('Session user object:', sessionUser);
    }
    
    await prisma.$disconnect();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Error in middleware test:', error);
    await prisma.$disconnect();
  }
}

testMiddleware();
