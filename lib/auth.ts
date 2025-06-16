
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  username: string
  isAdmin: boolean
}

export async function verifyToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.userId) {
      return null
    }

    return {
      id: decoded.userId,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyToken(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  
  if (!user.isAdmin) {
    throw new Error('Admin access required')
  }
  
  return user
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.userId) {
      return null
    }

    // Verify user still exists in database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        is_admin: true
      }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin
    }
  } catch (error) {
    console.error('Get user from token error:', error)
    return null
  }
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
  )
}

export async function getCurrentUser(request: NextRequest): Promise<{
  id: string
  username: string
  is_admin: boolean
} | null> {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.userId) {
      return null
    }

    // Get fresh user data from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        is_admin: true
      }
    })

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Legacy function aliases for backward compatibility
export async function getSession(request?: NextRequest): Promise<AuthUser | null> {
  if (!request) {
    return null
  }
  return await verifyToken(request)
}

export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.userId) {
      return null
    }

    return {
      id: decoded.userId,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false
    }
  } catch (error) {
    console.error('Server session error:', error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  // This is handled by clearing the cookie in the logout route
  return
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser> {
  return await requireAuth(request)
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs')
  return await bcrypt.hash(password, 10)
}
