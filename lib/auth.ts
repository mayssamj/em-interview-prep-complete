
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './db';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  preferences?: any;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Store session in cookies (in production, you'd want to use a proper session store)
  const cookieStore = cookies();
  cookieStore.set('session', `${userId}:${sessionId}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  return sessionId;
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('session');
    
    if (!session?.value) {
      return null;
    }
    
    const [userId] = session.value.split(':');
    
    if (!userId) {
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        isAdmin: true,
        preferences: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

export async function requireAuth(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (!user.isAdmin) {
    throw new Error('Admin access required');
  }
  return user;
}

export async function verifyAuth(request: Request): Promise<User | null> {
  try {
    // Extract session from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return null;
    }
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const session = cookies['session'];
    if (!session) {
      return null;
    }
    
    const [userId] = session.split(':');
    if (!userId) {
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        isAdmin: true,
        preferences: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}
