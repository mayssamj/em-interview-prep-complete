
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  email?: string;
}

export async function getSession(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Fetch fresh user data from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        is_admin: true,
        preferences: true,
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin,
      email: user.preferences?.email || undefined,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getSession(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<User> {
  const user = await requireAuth(request);
  
  if (!user.isAdmin) {
    throw new Error('Admin access required');
  }
  
  return user;
}

export function createToken(user: { id: string; username: string; isAdmin: boolean }): string {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username,
      isAdmin: user.isAdmin
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}
