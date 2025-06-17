
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const user = await getSession(request);

  // Redirect to login if not authenticated
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access for admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
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
