
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders, rateLimit, logSecurityEvent } from './lib/security';

// Simple JWT decode function for Edge runtime
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to authentication endpoints
  if (pathname.startsWith('/api/auth/')) {
    if (!rateLimit(request, { windowMs: 15 * 60 * 1000, maxRequests: 10 })) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { path: pathname }, request);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Apply general rate limiting to API endpoints
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(request, { windowMs: 15 * 60 * 1000, maxRequests: 100 })) {
      logSecurityEvent('API_RATE_LIMIT_EXCEEDED', { path: pathname }, request);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];
  
  // API paths that don't require authentication
  const publicApiPaths = [
    '/api/companies',
    '/api/questions',
    '/api/system-design-questions',
    '/api/system-design-frameworks',
    '/api/system-design-categories',
  ];

  // Check if the path is public
  if (publicPaths.includes(pathname) || publicApiPaths.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Check authentication for protected routes
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { path: pathname }, request);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    return addSecurityHeaders(response);
  }

  // Verify JWT token
  const decoded = decodeJWT(token);
  if (!decoded) {
    logSecurityEvent('INVALID_TOKEN', { path: pathname }, request);
    // Invalid or expired token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    return addSecurityHeaders(response);
  }

  const user = {
    id: decoded.userId,
    username: decoded.username,
    isAdmin: decoded.isAdmin
  };

  // Check admin access for admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!user.isAdmin) {
      logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', { 
        path: pathname, 
        userId: user.id, 
        username: user.username 
      }, request);
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      return addSecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
