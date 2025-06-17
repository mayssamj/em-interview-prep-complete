
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // CSRF Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

// Rate limiting function (temporarily disabled for testing)
export function rateLimit(
  request: NextRequest,
  options: { windowMs: number; maxRequests: number } = { windowMs: 15 * 60 * 1000, maxRequests: 100 }
): boolean {
  // Temporarily disable rate limiting for testing
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
    return true;
  }
  
  if (record.count >= options.maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input validation schemas
export const authSchemas = {
  login: z.object({
    username: z.string().min(1, 'Username is required').max(50),
    password: z.string().min(1, 'Password is required').max(100),
  }),
  
  register: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  }),
};

export const questionSchemas = {
  create: z.object({
    question_text: z.string().min(10, 'Question must be at least 10 characters').max(1000),
    category: z.string().min(1, 'Category is required').max(100),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    company_id: z.string().uuid().optional(),
    tags: z.array(z.string()).optional(),
    is_critical: z.boolean().optional(),
  }),
};

export const storySchemas = {
  create: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    situation: z.string().min(10, 'Situation must be at least 10 characters').max(2000),
    task: z.string().min(10, 'Task must be at least 10 characters').max(2000),
    action: z.string().min(10, 'Action must be at least 10 characters').max(2000),
    result: z.string().min(10, 'Result must be at least 10 characters').max(2000),
    reflection: z.string().max(2000).optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
  }),
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags completely
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*[^>\s]*/gi, '') // Remove event handlers more thoroughly
    .trim();
}

// Password strength validation
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In a real implementation, you'd store and validate CSRF tokens properly
  return token === sessionToken;
}

// Secure cookie options
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60, // 24 hours
  path: '/',
};

// Error logging with security considerations
export function logSecurityEvent(event: string, details: any, request?: NextRequest) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    details: typeof details === 'string' ? details : JSON.stringify(details),
    ip: request?.ip || request?.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
    url: request?.url || 'unknown',
  };
  
  // In production, send to proper logging service
  console.warn('SECURITY EVENT:', logData);
}
