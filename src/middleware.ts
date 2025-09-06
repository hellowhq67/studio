
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  const accountUrl = new URL('/account', request.url);

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    const userRole = request.cookies.get('user_role')?.value;
    const authToken = request.cookies.get('auth_token')?.value;

    
    if (!authToken /*|| userRole !== 'ADMIN'*/) {
        // Not authenticated or not an admin, redirect to login page.
        // You could redirect to an unauthorized page or the home page as well.
        return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
