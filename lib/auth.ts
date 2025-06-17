
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import { safeEmailExtract } from './type-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  email?: string;
}

export async function getSession(request?: NextRequest): Promise<User | null> {
  try {
    let token: string | undefined;
    
    if (request) {
      token = request.cookies.get('token')?.value;
    } else {
      // Server-side usage
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
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
      email: safeEmailExtract(user.preferences),
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

// Server-side session function for pages
export async function getServerSession(): Promise<User | null> {
  return getSession();
}
