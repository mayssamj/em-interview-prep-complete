
import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAuth, requireAdmin } from './auth';
import { handleApiError, logError } from './error-handler';
import { ZodSchema } from 'zod';

export interface ApiContext {
  user?: any;
  isAdmin?: boolean;
}

export function withAuth(handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = await requireAuth(req);
      return await handler(req, { user, isAdmin: user.isAdmin });
    } catch (error) {
      logError(error, 'withAuth');
      return handleApiError(error);
    }
  };
}

export function withAdminAuth(handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = await requireAdmin(req);
      return await handler(req, { user, isAdmin: true });
    } catch (error) {
      logError(error, 'withAdminAuth');
      return handleApiError(error);
    }
  };
}

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T, context?: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: ApiContext): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const validatedData = schema.parse(body);
      return await handler(req, validatedData, context);
    } catch (error) {
      logError(error, 'withValidation');
      return handleApiError(error);
    }
  };
}

export function withErrorHandling(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      logError(error, 'API Handler');
      return handleApiError(error);
    }
  };
}

export function createSuccessResponse(data?: any, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      ...(data && { data }),
    },
    { status }
  );
}

export function createErrorResponse(error: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  );
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);
  
  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
