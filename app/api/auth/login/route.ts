
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authSchemas, sanitizeInput, logSecurityEvent, secureCookieOptions } from '@/lib/security'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input using Zod schema
    const validation = authSchemas.login.safeParse(body);
    if (!validation.success) {
      logSecurityEvent('INVALID_LOGIN_INPUT', validation.error.errors, request);
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { username, password } = validation.data;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);

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
        WHERE username = ${sanitizedUsername}
        LIMIT 1
      `;
      
      user = users.length > 0 ? users[0] : null;
      console.log('User query result:', user ? 'User found' : 'User not found');
    } catch (dbError) {
      console.error('Database query error:', dbError);
      logSecurityEvent('DATABASE_ERROR', { error: dbError.message }, request);
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!user) {
      logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', { username: sanitizedUsername }, request);
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
        username: sanitizedUsername, 
        userId: user.id 
      }, request);
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

    // Log successful login
    logSecurityEvent('LOGIN_SUCCESS', { 
      username: sanitizedUsername, 
      userId: user.id,
      isAdmin: user.is_admin 
    }, request);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    })

    response.cookies.set('token', token, secureCookieOptions)

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
