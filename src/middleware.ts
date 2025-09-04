
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  const accountUrl = new URL('/account', request.url);

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    if (!authToken) {
      // Not authenticated, redirect to login
      return NextResponse.redirect(loginUrl);
    }
    
    if (userRole !== 'ADMIN') {
        // Authenticated but not an admin, redirect to account page
        return NextResponse.redirect(accountUrl);
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
