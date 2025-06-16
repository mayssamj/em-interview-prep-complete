
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Initialize Prisma client with error handling
    let prisma;
    try {
      const { PrismaClient } = require('@prisma/client');
      prisma = new PrismaClient();
      await prisma.$connect();
    } catch (prismaError) {
      console.error('Prisma connection error:', prismaError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    let user;
    try {
      // Use raw SQL query instead of Prisma ORM
      const users = await prisma.$queryRaw`
        SELECT id, username, password_hash, is_admin 
        FROM users 
        WHERE username = ${username}
        LIMIT 1
      `;
      
      user = users.length > 0 ? users[0] : null;
      console.log('User query result:', user ? 'User found' : 'User not found');
    } catch (dbError) {
      console.error('Database query error:', dbError);
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!user) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        isAdmin: user.is_admin
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })

    await prisma.$disconnect();
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
