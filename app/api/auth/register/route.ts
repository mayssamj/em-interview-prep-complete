
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { 
  authSchemas, 
  sanitizeInput, 
  logSecurityEvent, 
  secureCookieOptions,
  validatePasswordStrength 
} from '@/lib/security'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input using Zod schema
    const validation = authSchemas.register.safeParse(body);
    if (!validation.success) {
      logSecurityEvent('INVALID_REGISTER_INPUT', validation.error.errors, request);
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { username, email, password } = validation.data;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = email ? sanitizeInput(email) : undefined;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      logSecurityEvent('WEAK_PASSWORD_ATTEMPT', { 
        username: sanitizedUsername,
        errors: passwordValidation.errors 
      }, request);
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { username: sanitizedUsername }
    })

    if (existingUser) {
      logSecurityEvent('REGISTRATION_FAILED_USER_EXISTS', { username: sanitizedUsername }, request);
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.users.create({
      data: {
        id: uuidv4(),
        username: sanitizedUsername,
        password_hash: hashedPassword,
        preferences: sanitizedEmail ? { email: sanitizedEmail } : null,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // Log successful registration
    logSecurityEvent('REGISTRATION_SUCCESS', { 
      username: sanitizedUsername, 
      userId: user.id,
      hasEmail: !!sanitizedEmail 
    }, request);

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
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    })

    response.cookies.set('token', token, secureCookieOptions)

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
