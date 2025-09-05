
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  const accountUrl = new URL('/admin', request.url);

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    const userRole = request.cookies.get('user_role')?.value;

    
    if (userRole&&userRole=="ADMIN"){
        // Authenticated but not an admin, redirect to account page
        return NextResponse.redirect(accountUrl);
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
